import { expect } from 'chai';
import 'mocha';
import { CobolVariable, Type } from '../../../lsp/completion/CobolVariable';
import { error } from 'util';

describe('Cobol variable test', () => {

    it('Check Cobol variable parsing', () => {
        //
        let variable = CobolVariable.parseLine("           05 w-var               pic is 9(100) ");
        expect(5).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           05 w-var               pic is 9(100) ").to.equal(variable.getRaw());
        expect("9(100)").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is 9(100) ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 9(100) ").to.equal(variable.getRaw());
        expect("9(100)").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is 9(100)v9 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 9(100)v9 ").to.equal(variable.getRaw());
        expect("9(100)v9").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is 99v99 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 99v99 ").to.equal(variable.getRaw());
        expect("99v99").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is s99v99 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is s99v99 ").to.equal(variable.getRaw());
        expect("s99v99").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is -99 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is -99 ").to.equal(variable.getRaw());
        expect("-99").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is -99 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is -99 ").to.equal(variable.getRaw());
        expect("-99").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic is zz9 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is zz9 ").to.equal(variable.getRaw());
        expect("zz9").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               pic zz9 ");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic zz9 ").to.equal(variable.getRaw());
        expect("zz9").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("25 MINHA-VARIAVEL               pic -bbbbb ");
        expect(25).to.equal(variable.getLevel());
        expect("MINHA-VARIAVEL").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("25 MINHA-VARIAVEL               pic -bbbbb ").to.equal(variable.getRaw());
        expect("-bbbbb").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("           10 w-var               PIC 9(100)v9");
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               PIC 9(100)v9").to.equal(variable.getRaw());
        expect("9(100)v9").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("05 w-varr3             pic xxx         value is spaces.");
        expect(5).to.equal(variable.getLevel());
        expect("w-varr3").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-varr3             pic xxx         value is spaces.").to.equal(variable.getRaw());
        expect("xxx").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("05 w-varr3             pic xxx");
        expect(5).to.equal(variable.getLevel());
        expect("w-varr3").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-varr3             pic xxx").to.equal(variable.getRaw());
        expect("xxx").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("05 w-var               pic is 999,99 ");
        expect(5).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-var               pic is 999,99 ").to.equal(variable.getRaw());
        expect("999,99").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("05 w-data              pic is 99/99/9999 value is zeros.");
        expect(5).to.equal(variable.getLevel());
        expect("w-data").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-data              pic is 99/99/9999 value is zeros.").to.equal(variable.getRaw());
        expect("99/99/9999").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("10 w-dia            pic is 9(02).");
        expect(10).to.equal(variable.getLevel());
        expect("w-dia").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("10 w-dia            pic is 9(02).").to.equal(variable.getRaw());
        expect("9(02)").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("01  wrk-campos.");
        expect(1).to.equal(variable.getLevel());
        expect("wrk-campos").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("01  wrk-campos.").to.equal(variable.getRaw());
        expect("").to.equal(variable.getPicture());
        //
        variable = CobolVariable.parseLine("05 filler    redefines w-data.");
        expect(5).to.equal(variable.getLevel());
        expect("filler").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 filler    redefines w-data.").to.equal(variable.getRaw());
        expect("").to.equal(variable.getPicture());
    });
});