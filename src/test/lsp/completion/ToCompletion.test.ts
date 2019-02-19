import { expect } from 'chai';
import 'mocha';
import { ToCompletion } from '../../../lsp/completion/ToCompletion';

    describe('To completion', () => {
    //
        it('Checks To text completion', async () => {
            expect("  to ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    t", 27))
            expect(" to  ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    t", 28))
            expect("to   ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    t", 29))
            expect("to   ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    ", 29))
            expect("to   ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    t", 30))
            expect("to   ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    ", 30))
            expect("to   ").to.equal(new ToCompletion().buildToTextWithIndent("              move spaces    to", 31))
            expect("    to   ").to.equal(new ToCompletion().buildToTextWithIndent("           move    w-idv t", 26))
        });
    });
