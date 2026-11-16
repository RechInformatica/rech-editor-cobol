import { ExtensionContext, OutputChannel, TextDocument, window, workspace } from 'vscode';
import { CloseAction, ErrorAction, LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo } from 'vscode-languageclient/node';
import * as cp from 'child_process';
import { PassThrough } from 'stream';
import { Log } from '../commons/Log';
import { CopyUsageLocator } from './completion/copy/CopyUsageLocator';

type JavaLspStatus = 'disabled' | 'idle' | 'starting' | 'running' | 'failed';

export class JavaLspManager {
	private javaClient: LanguageClient | undefined;
	private javaProcess: cp.ChildProcess | undefined;
	private javaOutput: OutputChannel | undefined;
	private javaStatus: JavaLspStatus = 'disabled';
	private javaLifecycle: Promise<void> = Promise.resolve();
	private disposed = false;

	public constructor(private readonly requestNodeRevalidation: () => void) {}

	public initialize(context: ExtensionContext) {
		this.disposed = false;
		this.javaStatus = 'idle';
		this.javaOutput = window.createOutputChannel('Cobol LSP (diagnósticos)');
		context.subscriptions.push(this.javaOutput);
		context.subscriptions.push(
			workspace.onDidOpenTextDocument(document => {
				if (this.isCobolFile(document)) this.requestJavaStart();
			})
		);
		if (this.hasCobolDocuments()) this.requestJavaStart();
	}

	public ownsDiagnostics(): boolean {
		return this.javaStatus !== 'disabled' && this.javaStatus !== 'failed';
	}

	public stop(): Promise<void> {
		this.disposed = true;
		const immediateTermination = this.javaStatus === 'starting'
			? this.terminateJavaProcess()
			: undefined;
		return this.enqueueJavaLifecycle(async () => {
			if (immediateTermination) await immediateTermination;
			await this.stopJava('disabled');
		});
	}

	private isCobolFile(document: TextDocument): boolean {
		return document.languageId === 'COBOL' && document.uri.scheme === 'file';
	}

	private hasCobolDocuments(): boolean {
		return workspace.textDocuments.some(document => this.isCobolFile(document));
	}

	private enqueueJavaLifecycle(operation: () => Promise<void>): Promise<void> {
		const previous = this.javaLifecycle.catch(() => undefined);
		const current = previous.then(operation);
		this.javaLifecycle = current.catch(error => {
			Log.get().error("Ciclo de vida do LSP Java: " + error);
		});
		return current;
	}

	private requestJavaStart() {
		if (this.disposed || this.javaStatus === 'disabled' || this.javaStatus === 'failed') return;
		if (this.javaStatus === 'starting' || this.javaStatus === 'running') return;
		this.enqueueJavaLifecycle(() => this.startJava());
	}

	private async startJava(): Promise<void> {
		if (this.disposed || this.javaStatus !== 'idle' || !this.hasCobolDocuments()) return;

		const javaClient = this.createJavaClient();
		this.javaClient = javaClient;
		this.javaStatus = 'starting';
		try {
			await javaClient.start();
		} catch (error) {
			const nextStatus: JavaLspStatus = this.disposed ? 'disabled' : 'failed';
			await this.discardJava(nextStatus, javaClient);
			if (nextStatus === 'failed') Log.get().error("Falha ao iniciar o LSP Java: " + error);
			return;
		}

		this.javaStatus = 'running';
		if (this.disposed) {
			await this.stopJava('disabled', javaClient);
		}
	}

	private async stopJava(nextStatus: JavaLspStatus, expectedClient?: LanguageClient): Promise<void> {
		const javaClient = this.javaClient;
		if (expectedClient && javaClient !== expectedClient) return;
		if (javaClient && javaClient.isRunning()) {
			try {
				await javaClient.stop(3000);
			} catch (error) {
				Log.get().error("Falha ao parar o LSP Java: " + error);
			}
		}
		await this.discardJava(nextStatus, javaClient);
	}

	private async discardJava(nextStatus: JavaLspStatus, expectedClient?: LanguageClient): Promise<void> {
		if (expectedClient && this.javaClient !== expectedClient) return;
		await this.terminateJavaProcess();
		this.javaClient = undefined;
		this.javaStatus = nextStatus;
		if (nextStatus === 'failed') this.requestNodeRevalidation();
	}

	private terminateJavaProcess(): Promise<void> {
		const javaProcess = this.javaProcess;
		if (!javaProcess || javaProcess.exitCode !== null) return Promise.resolve();
		return new Promise(resolve => {
			let finished = false;
			let timeout: NodeJS.Timeout | undefined;
			const finish = () => {
				if (finished) return;
				finished = true;
				if (timeout) clearTimeout(timeout);
				resolve();
			};
			javaProcess.once('exit', finish);
			try {
				if (!javaProcess.killed) javaProcess.kill();
			} catch (error) {
				Log.get().error("Falha ao encerrar o processo do LSP Java: " + error);
				finish();
				return;
			}
			timeout = setTimeout(() => {
				if (javaProcess.exitCode !== null) {
					finish();
					return;
				}
				try {
					if (globalThis.process.platform === 'win32' && javaProcess.pid) {
						cp.execFile('taskkill', ['/PID', String(javaProcess.pid), '/T', '/F'], () => finish());
					} else {
						javaProcess.kill('SIGKILL');
						finish();
					}
				} catch (error) {
					Log.get().error("Falha ao forçar o encerramento do processo do LSP Java: " + error);
					finish();
				}
			}, 3000);
		});
	}

	private markJavaFailed(javaClient: LanguageClient) {
		if (this.javaClient !== javaClient || this.javaStatus !== 'running' || this.disposed) return;
		this.enqueueJavaLifecycle(() => this.discardJava('failed', javaClient));
	}

	private createJavaClient(): LanguageClient {
		const config = workspace.getConfiguration("rech.editor.cobol");
		const internalConfig = workspace.getConfiguration("rech.editor.internal");
		const classPath = config.get<string>("cobolLsp.classPath", "");
		const defaultPreprocOptions = ["-cpn", "-spn", "-msi", "-vnp", "-war", "-wes", "-cem", "-wop=ALL"];
		const workspaceCopyDirs = (workspace.workspaceFolders ?? []).map(folder => folder.uri.fsPath);
		const configuredCopyDirs = config.get<string[]>("cobolLsp.copyDirs", []);
		const copyDirs = [...workspaceCopyDirs, ...configuredCopyDirs];
		let javaClient: LanguageClient | undefined;
		let failurePending = false;
		let defaultErrorHandler: ReturnType<LanguageClient['createDefaultErrorHandler']> | undefined;
		const clientOptions: LanguageClientOptions = {
			documentSelector: [{ scheme: 'file', language: 'COBOL' }],
			outputChannel: this.javaOutput,
			initializationOptions: {
				cobol: {
					copyDirs: copyDirs,
					preprocessorOptions: config.get<string[]>("cobolLsp.preprocessorOptions", defaultPreprocOptions),
					noShowWarnings: internalConfig.get<string[]>("diagnosticfilter", []),
					deprecatedWarning: internalConfig.get<string[]>("deprecatedWarning", [])
				}
			},
			errorHandler: {
				error: async (error, message, count) => {
					const result = defaultErrorHandler
						? await defaultErrorHandler.error(error, message, count)
						: { action: ErrorAction.Shutdown };
					if (result.action === ErrorAction.Shutdown) failurePending = true;
					return result;
				},
				closed: async () => {
					const result = defaultErrorHandler
						? await defaultErrorHandler.closed()
						: { action: CloseAction.DoNotRestart };
					if (result.action === CloseAction.DoNotRestart) failurePending = true;
					return result;
				}
			}
		};
		javaClient = new LanguageClient(
			'cobolJavaLsp',
			'Cobol LSP (diagnósticos)',
			this.buildJavaServerOptions(classPath),
			clientOptions
		);
		defaultErrorHandler = javaClient.createDefaultErrorHandler();
		javaClient.onDidChangeState(() => {
			if (failurePending && !javaClient.isRunning()) {
				failurePending = false;
				this.markJavaFailed(javaClient);
			}
		});
		this.configureJavaClientWhenReady(javaClient);
		return javaClient;
	}

	private configureJavaClientWhenReady(javaClient: LanguageClient) {
		javaClient.onRequest("custom/showQuickPick", async (params: { titulo: string, itens: string[], multipla: boolean }) => {
			const items = params.itens.map(item => ({ label: item, picked: true }));
			const resultado = await window.showQuickPick(items, {
				title: params.titulo,
				canPickMany: params.multipla,
				placeHolder: "Selecione os métodos a implementar"
			});
			if (!resultado) return [];
			if (Array.isArray(resultado)) {
				return resultado.map((i: { label: string }) => i.label);
			}
			return [(resultado as { label: string }).label];
		});
		javaClient.onRequest("custom/copyUsageLocator", (copy: string) => {
			return CopyUsageLocator.findUsage(copy);
		});
	}

	private buildJavaServerOptions(classPath: string): ServerOptions {
		const config = workspace.getConfiguration("rech.editor.cobol");
		const javaPath = config.get<string>("cobolLsp.javaPath", "java");
		const jvmArgs = config.get<string[]>("cobolLsp.jvmArgs", []);
		const mainClass = config.get<string>("cobolLsp.mainClass",
			"br.com.rech.preproc.lsp.Main");

		return (): Promise<StreamInfo> => new Promise<StreamInfo>((resolve, reject) => {
			const args = [...jvmArgs, '-cp', classPath, mainClass, '--lsp'];
			const proc = cp.spawn(javaPath, args, {
				stdio: ['pipe', 'pipe', 'pipe']
			});
			this.javaProcess = proc;
			proc.once('exit', () => {
				if (this.javaProcess === proc) this.javaProcess = undefined;
			});
			proc.on('error', (err) => reject(err));

			proc.stderr?.on('data', (chunk: Buffer | string) => {
				this.javaOutput?.append(Buffer.isBuffer(chunk) ? chunk.toString() : chunk);
			});

			const lspStream = new PassThrough();
			let buffered = Buffer.alloc(0);
			let forwarding = false;

			proc.stdout!.on('data', (chunk: Buffer) => {
				if (forwarding) {
					lspStream.write(chunk);
					return;
				}
				buffered = Buffer.concat([buffered, chunk]);
				const idx = buffered.indexOf('Content-Length:');
				if (idx >= 0) {
					forwarding = true;
					lspStream.write(buffered.slice(idx));
					buffered = Buffer.alloc(0);
				}
			});
			proc.stdout!.on('end', () => lspStream.end());
			proc.stdout!.on('error', (e) => lspStream.destroy(e));

			resolve({ reader: lspStream, writer: proc.stdin! });
		});
	}
}