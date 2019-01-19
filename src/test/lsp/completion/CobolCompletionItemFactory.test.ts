import { expect } from 'chai';
import 'mocha';
import { CobolCompletionItemFactory } from '../../../lsp/completion/CobolCompletionItemFactory';

    describe('Cobol completion factory', () => {

        it('Checks cobol unhandled command', () => {
            //
            let lines = [" move w-idv to w-adv.", "eval", "blablabla", "blablabla,", " outro   ", " outro   ,   ", " outro   ,"];
            expect(false).to.equal(new CobolCompletionItemFactory(1,1, lines).isUnhandledCommand());
            expect(false).to.equal(new CobolCompletionItemFactory(2,1, lines).isUnhandledCommand());
            expect(false).to.equal(new CobolCompletionItemFactory(3,1, lines).isUnhandledCommand());
            expect(true).to.equal(new CobolCompletionItemFactory(4,1, lines).isUnhandledCommand());
            expect(true).to.equal(new CobolCompletionItemFactory(5,1, lines).isUnhandledCommand());
            expect(true).to.equal(new CobolCompletionItemFactory(6,1, lines).isUnhandledCommand());
        });
    });