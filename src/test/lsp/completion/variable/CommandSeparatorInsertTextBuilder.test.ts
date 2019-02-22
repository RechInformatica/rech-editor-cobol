import { expect } from 'chai';
import 'mocha';
import { CommandSeparatorInsertTextBuilder } from '../../../../lsp/completion/variable/CommandSeparatorInsertTextBuilder';


    describe('Variable suggestions insert text with command separator', () => {

        it('Checks the insertText of w-i with to clause', async () => {
            let text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", "           move    w-i", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of w-i with to claused', async () => {
            let text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", "           move    w-id", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of w-i with to clausedv', async () => {
            let text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", "           move    w-idv", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of my-b with to clauseig-var', async () => {
            let text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("my-big-variable", "           move    my-big-var", 10);
            expect("my-big-variable to ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract clause', async () => {
            let text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", "           subtract w-i", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract claused', async () => {
            let text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", "           subtract w-id", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract clausedv', async () => {
            let text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", "           subtract w-idv", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of my-b with subtract clauseig-var', async () => {
            let text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("my-big-variable", "           subtract my-big-var", 10);
            expect("my-big-variable from ").to.equal(text);
        });

    });