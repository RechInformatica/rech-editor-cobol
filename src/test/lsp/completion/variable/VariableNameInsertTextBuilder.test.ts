import { expect } from 'chai';
import 'mocha';
import { CommandSeparatorInsertTextBuilder } from '../../../../lsp/completion/variable/CommandSeparatorInsertTextBuilder';
import { VariableNameInsertTextBuilder } from '../../../../lsp/completion/variable/VariableNameInsertTextBuilder';


    describe('Variable suggestions insert text with variable name', () => {

        it('Checks the insertText of w-i with to clause', async () => {
            let text = new VariableNameInsertTextBuilder().buildInsertText("w-idv", "           move    w-i");
            expect("w-idv").to.equal(text);
        });

    });