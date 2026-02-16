import { expect } from 'chai';
import { MethodModifyersCompletion, MethodModifier } from '../../../lsp/completion/MethodModifyersCompletion';

describe('MethodModifyersCompletion', () => {

    it('Adiciona override em método com parâmetros e returning', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) returning wout-ano.'];
        const completion = new MethodModifyersCompletion(MethodModifier.OVERRIDE);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning wout-ano override.');
    });

    it('Adiciona static em método com parâmetros e returning', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) returning wout-ano.'];
        const completion = new MethodModifyersCompletion(MethodModifier.STATIC);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning wout-ano static.');
    });

    it('Adiciona protected em método com parâmetros e returning', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) returning wout-ano.'];
        const completion = new MethodModifyersCompletion(MethodModifier.PROTECTED);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning wout-ano protected.');
    });

    it('Adiciona returning em método com parâmetros sem returning', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar).'];
        const completion = new MethodModifyersCompletion(MethodModifier.RETURNING);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning $1.');
    });

    it('Adiciona static em método já com override', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) override.'];
        const completion = new MethodModifyersCompletion(MethodModifier.STATIC);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) override static.');
    });

    it('Adiciona override em método com static e returning', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) returning wout-ano static.'];
        const completion = new MethodModifyersCompletion(MethodModifier.OVERRIDE);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning wout-ano static override.');
    });

    it('Adiciona returning em método com static e protected', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) static protected.'];
        const completion = new MethodModifyersCompletion(MethodModifier.RETURNING);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning $1 static protected.');
    });

    it('Não duplica modificador já existente', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) static.'];
        const completion = new MethodModifyersCompletion(MethodModifier.STATIC);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        // Não deve duplicar o static
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) static.');
    });

    it('Mantém ordem: returning antes dos modificadores simples', async () => {
        const lines = ['       method-id. nextYear(inYear as INumericVar) returning wout-ano public.'];
        const completion = new MethodModifyersCompletion(MethodModifier.STATIC);
        const result = await completion.generate(0, 0, lines);

        expect(result.length).to.equal(1);
        // returning vem primeiro, depois public e static
        expect(result[0].insertText).to.equal('       method-id. nextYear(inYear as INumericVar) returning wout-ano public static.');
    });

});
