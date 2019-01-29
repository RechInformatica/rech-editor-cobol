import { expect } from 'chai';
import 'mocha';
import { CobolCompletionItemFactory } from '../../../lsp/completion/CobolCompletionItemFactory';
import { IfHighlight } from '../../../lsp/highlight/IfHighlight';

    describe('Cobol completion factory', () => {

        it('Checks If Highlight', () => {
            //
            expect(false).to.equal(new IfHighlight().isABlockTerm("w-verificacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("ificacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("icacaoif"));
            //
            expect(false).to.equal(new IfHighlight().isABlockTerm("w-verelseicacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("elseicacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("icacaoelse"));
            //
            expect(false).to.equal(new IfHighlight().isABlockTerm("w-verend-ificacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("end-ificacao"));
            expect(false).to.equal(new IfHighlight().isABlockTerm("icacaoend-if"));
            //
            expect(true).to.equal(new IfHighlight().isABlockTerm("if"));
            expect(true).to.equal(new IfHighlight().isABlockTerm("else"));
            expect(true).to.equal(new IfHighlight().isABlockTerm("end-if"));
        });
    });