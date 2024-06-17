import { expect } from 'chai';
import 'mocha';
import { CommandSeparatorInsertTextBuilder } from '../../../../lsp/completion/variable/CommandSeparatorInsertTextBuilder';


    describe('Variable suggestions insert text with command separator', () => {

        it('Checks the insertText of w-i with to clause', async () => {
            const text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", false, "           move    w-i", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of w-i with to claused', async () => {
            const text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", false, "           move    w-id", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of w-i with to clausedv', async () => {
            const text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("w-idv", false, "           move    w-idv", 10);
            expect("w-idv     to   ").to.equal(text);
        });
        it('Checks the insertText of my-b with to clauseig-var', async () => {
            const text = new CommandSeparatorInsertTextBuilder("to").buildInsertText("my-big-variable", false, "           move    my-big-var", 10);
            expect("my-big-variable to ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract clause', async () => {
            const text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", false, "           subtract w-i", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract claused', async () => {
            const text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", false, "           subtract w-id", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of w-i with subtract clausedv', async () => {
            const text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("w-idv", false, "           subtract w-idv", 10);
            expect("w-idv    from ").to.equal(text);
        });
        it('Checks the insertText of my-b with subtract clauseig-var', async () => {
            const text = new CommandSeparatorInsertTextBuilder("from").buildInsertText("my-big-variable", false, "           subtract my-big-var", 10);
            expect("my-big-variable from ").to.equal(text);
        });

    });
