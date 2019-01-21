import { expect } from 'chai';
import 'mocha';
import { CompletionUtils } from '../../../lsp/commons/CompletionUtils';

  describe('CompletionUtils functions', () => {

    it('Checks filling missing spaces without line text', () => {
      expect("    ").to.equal(CompletionUtils.fillMissingSpaces(10, 5));
      expect("         ").to.equal(CompletionUtils.fillMissingSpaces(15, 5));
      expect("   ").to.equal(CompletionUtils.fillMissingSpaces(5, 1));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(10, 10));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(10, 12));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(35, 35));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(35, 34));
    });

    it('Checks filling missing spaces with line text', () => {
      expect("") .to.equal(CompletionUtils.fillMissingSpaces(35, 34, "           05 w-var               "));
      expect("") .to.equal(CompletionUtils.fillMissingSpaces(35, 35, "           05 w-var                "));
      expect("") .to.equal(CompletionUtils.fillMissingSpaces(3, 5, "           05 w-var               "));
      expect("") .to.equal(CompletionUtils.fillMissingSpaces(3, 3, "           05 w-var               "));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(35, 34, "           05 w-var              L"));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(35, 33, "           05 w-var              "));
      expect("  ").to.equal(CompletionUtils.fillMissingSpaces(35, 32, "           05 w-var             "));
      expect("   ").to.equal(CompletionUtils.fillMissingSpaces(35, 31, "           05 w-var            "));
    });

    it('Checks filling exact missing spaces', () => {
      expect("                   ").to.equal(CompletionUtils.fillExactMissingSpaces(35, 15, "                                  "));
      expect("                               ").to.equal(CompletionUtils.fillExactMissingSpaces(35, 3, "        "));
      expect("                                ").to.equal(CompletionUtils.fillExactMissingSpaces(35, 2, "              "));
      expect("          ").to.equal(CompletionUtils.fillExactMissingSpaces(35, 27, "                        pic"));
      expect("").to.equal(CompletionUtils.fillExactMissingSpaces(35, 43, "                                        pic"));
      expect("                                  ").to.equal(CompletionUtils.fillExactMissingSpaces(35, 0, ""));
      

    });

  });

  describe('Count spaces at beginning test', () => {
    it('Count spaces at beginning', () => {
      expect(0).to.equal(CompletionUtils.countSpacesAtBeginning("Teste"));
      expect(3).to.equal(CompletionUtils.countSpacesAtBeginning("   Teste"));
      expect(0).to.equal(CompletionUtils.countSpacesAtBeginning(""));
      expect(18).to.equal(CompletionUtils.countSpacesAtBeginning("                  Teste"));
    });

  });