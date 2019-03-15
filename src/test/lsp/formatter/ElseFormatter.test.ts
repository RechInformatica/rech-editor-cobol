import { expect } from 'chai';
import 'mocha';
import { ElseFormatter } from '../../../lsp/formatter/ElseFormatter';

  describe('Else formatter', () => {

    it('Checks the start column with only one \'if\' condition', () => {
      let buffer = [
        "      *>-> Condicação de exemplo",
        "           if minha-condicao",
        "              perform meu-paragrafo,",
        "              ",
      ];
      expect(11).to.equal(new ElseFormatter().findStartColumn(3, buffer));
    });

    it('Checks the start column with only one \'if\' and \'end-if\' condition', () => {
      let buffer = [
        "      *>-> Condicação de exemplo",
        "           if minha-condicao",
        "              perform meu-paragrafo,",
        "              ",
        "           end-if.",
      ];
      expect(11).to.equal(new ElseFormatter().findStartColumn(3, buffer));
    });

    it('Checks the start column with two \'if\' and \'end-if\' condition', () => {
      let buffer = [
        "      *>-> Condicação de exemplo",
        "           if minha-condicao",
        "              if outra-condicao",
        "",
        "              end-if,",
        "           end-if.",
      ];
      expect(14).to.equal(new ElseFormatter().findStartColumn(3, buffer));
    });

    it('Checks the start column with three \'if\' and \'end-if\' condition', () => {
      let buffer = [
        "      *>-> Condicação de exemplo",
        "           if minha-condicao",
        "              if outra-condicao",
        "                 if outra-condicao",
        "",
        "                 end-if,",
        "              end-if,",
        "           end-if.",
      ];
      expect(17).to.equal(new ElseFormatter().findStartColumn(4, buffer));
    });

    it('Checks the start column after a nested \'end-if\'', () => {
      let buffer = [
        "      *>-> Condicação de exemplo",
        "           if condicao",
        "              if outra-condicao",
        "                 if terceira-condicao",
        "",
        "                 end-if,",
        "              end-if,",
        "",
        "           end-if.",
      ];
      expect(11).to.equal(new ElseFormatter().findStartColumn(7, buffer));
    });

  });