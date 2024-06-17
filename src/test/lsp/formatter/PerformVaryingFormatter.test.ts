import { expect } from 'chai';
import 'mocha';
import { PerformVaryingFormatter } from '../../../lsp/formatter/PerformVaryingFormatter';


  describe('Find the until clause', () => {

    it('Not Find the line of the until clause for teste before perform loop in until exit loop', () => {
      const buffer = [
        "      *>-> Laço de navegação entre as janelas",
        "           PERFORM                UNTIL EXIT",
        "      *>-> Avalia a janela que deve ser aceita",
        "              EVALUATE            W-INDJAN,"
      ];
      expect(undefined).to.equal(PerformVaryingFormatter.LineOfUntilClause(3, buffer));
    });

    it('Find the line of the until clause for teste before perform loop upercase', () => {
      const buffer = [
        "      *>-> Teste de laço",
        "           PERFORM",
        "              VARYING             W-IDV FROM 1 BY 1",
        "                 UNTIL            W-IDV > 10 AND",
        "                                  W-IDV < 30",
        "      *>-> Teste",
        "              PERFORM            PLIS-ACESEL,",
        "           END-PERFORM."
      ];
      expect(3).to.equal(PerformVaryingFormatter.LineOfUntilClause(6, buffer));
    });

    it('Find the line of the until clause for teste before perform loop lowercase', () => {
      const buffer = [
        "      *>-> Teste de laço",
        "           perform",
        "              varying             w-idv from 1 by 1",
        "                 until            w-idv > 10 and",
        "                                  W-IDV < 30",
        "      *>-> Teste",
        "              perform            plis-acesel,",
        "           end-perform."
      ];
      expect(3).to.equal(PerformVaryingFormatter.LineOfUntilClause(6, buffer));
    });

  });
