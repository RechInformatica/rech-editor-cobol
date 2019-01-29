import { expect } from 'chai';
import 'mocha';
import { CompletionUtils } from '../../../lsp/commons/CompletionUtils';

  describe('CompletionUtils functions', () => {

    it('Checks filling spaces from word start', () => {
      expect("                   ").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 15, "                                  "));
      expect("                               ").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 3, "        "));
      expect("                                ").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 2, "              "));
      expect("          ").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 27, "                        pic"));
      expect("").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 43, "                                        pic"));
      expect("                                  ").to.equal(CompletionUtils.fillSpacesFromWordStart(35, 0, ""));
    });

    it('Checks filling spaces from word end', () => {
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordEnd(20, 12, "           move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordEnd(20, 13, "           move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordEnd(20, 14, "           move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordEnd(20, 15, "           move"));
      expect(" ").to.equal(CompletionUtils.fillSpacesFromWordEnd(15, 20, "           move"));
      expect("         ").to.equal(CompletionUtils.fillSpacesFromWordEnd(20, 10, "               "));
    });

    it('Checks replacing last word', () => {
      expect("    primeira segunda").to.equal(CompletionUtils.replaceLastWord("    primeira seg", "segunda"));
      expect("    segunda").to.equal(CompletionUtils.replaceLastWord("    primeira", "segunda"));
      expect("    segunda").to.equal(CompletionUtils.replaceLastWord("    ", "segunda"));
      expect("segunda").to.equal(CompletionUtils.replaceLastWord("", "segunda"));
    });

    it('Checks filling spaces from last word replacement word', () => {
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 12, "           mo", "move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 13, "           m", "move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 14, "           ", "move"));
      expect("    ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 15, "           s", "move"));
      expect(" ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(15, 20, "           move", "abcd"));
      expect("         ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 10, "               ", ""));
      expect("  ").to.equal(CompletionUtils.fillSpacesFromWordReplacementEnd(20, 15, "               ", "fd"));
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