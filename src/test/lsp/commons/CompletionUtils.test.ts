import { expect } from 'chai';
import 'mocha';
import { CompletionUtils } from '../../../lsp/commons/CompletionUtils';

  describe('Fill missing spaces test', () => {

    it('Check filling missing spaces', () => {
      expect("    ").to.equal(CompletionUtils.fillMissingSpaces(10, 5));
      expect("         ").to.equal(CompletionUtils.fillMissingSpaces(15, 5));
      expect("   ").to.equal(CompletionUtils.fillMissingSpaces(5, 1));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(10, 10));
      expect(" ").to.equal(CompletionUtils.fillMissingSpaces(10, 12));
    });

  });

  describe('count spaces at beginning test', () => {

    it('count spaces at beginning', () => {
      expect(0).to.equal(CompletionUtils.countSpacesAtBeginning("Teste"));
      expect(3).to.equal(CompletionUtils.countSpacesAtBeginning("   Teste"));
      expect(0).to.equal(CompletionUtils.countSpacesAtBeginning(""));
      expect(18).to.equal(CompletionUtils.countSpacesAtBeginning("                  Teste"));
    });

  });