import { expect } from 'chai';
import 'mocha';
import { CommaDotInsertTextBuilder } from '../../../../lsp/completion/variable/CommaDotInsertTextBuilder';


    describe('Variable suggestions insert text with comma or dot separator', () => {

        it('Checks the insertText of w-i with comma', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "              move    w-i", 25);
            expect("w-idv,").to.equal(text);
        });
        it('Checks the insertText of w-i with dot', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "           move    w-i", 22);
            expect("w-idv.").to.equal(text);
        });
        it('Checks the insertText of w-i containing comma at the end', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "              move    w-i,", 26);
            expect("w-idv").to.equal(text);
        });
        it('Checks the insertText of w-i containing dot at the end', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "           move    w-i.", 23);
            expect("w-idv").to.equal(text);
        });
        it('Checks the insertText of w-i with comma but cursor on middle', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "              move    w-i", 20);
            expect("w-idv").to.equal(text);
        });

    });