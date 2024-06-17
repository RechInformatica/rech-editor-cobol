import { expect } from 'chai';
import 'mocha';
import { CommandSeparatorInsertTextBuilder } from '../../../../lsp/completion/variable/CommandSeparatorInsertTextBuilder';
import { VariableNameInsertTextBuilder } from '../../../../lsp/completion/variable/VariableNameInsertTextBuilder';


    describe('Variable suggestions insert text with variable name', () => {

        it('Checks the insertText of w-i with to clause', async () => {
            const text = new VariableNameInsertTextBuilder().buildInsertText("w-idv", false, "           move    w-i", 10);
            expect("w-idv").to.equal(text);
        });

    });
