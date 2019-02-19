import { expect } from 'chai';
import 'mocha';
import { CommaDotInsertTextBuilder } from '../../../../lsp/completion/variable/CommaDotInsertTextBuilder';


    describe('Variable suggestions insert text with comma or dot separator', () => {

        it('Checks the insertText of w-i with comma', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "              move    w-i");
            expect("w-idv,").to.equal(text);
        });
        it('Checks the insertText of w-i with dot', async () => {
            let text = new CommaDotInsertTextBuilder().buildInsertText("w-idv", "           move    w-i");
            expect("w-idv.").to.equal(text);
        });

    });