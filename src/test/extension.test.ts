
import { expect } from 'chai';
import 'mocha';
import { CobolVariable, Type } from '../lsp/completion/CobolVariable';



describe('Generic test', () => {

  it('Teste if 1 == 1', () => {
    expect(1).to.equal(1);
  });

});


describe('Cobol variable test', () => {

  it('Check Cobol variable parsing', () => {
    //
    let variable = CobolVariable.parseLine("           05 w-var               pic is 9(100) ");
    expect(5).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is 9(100) ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is 9(100)v9 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Decimal).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is 99v99 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Decimal).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is s99v99 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Decimal).to.equal(variable.getType());
    expect(true).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is -99 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(true).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is -99 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(true).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic is zz9 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               pic zz9 ");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("25 MINHA-VARIAVEL               pic -bbbbb ");
    expect(25).to.equal(variable.getLevel());
    expect("MINHA-VARIAVEL").to.equal(variable.getName());
    expect(Type.Integer).to.equal(variable.getType());
    expect(true).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("           10 w-var               PIC 9(100)v9");
    expect(10).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Decimal).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(false).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("05 w-varr3             pic xxx         value is spaces.");
    expect(5).to.equal(variable.getLevel());
    expect("w-varr3").to.equal(variable.getName());
    expect(Type.Alphanumeric).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("05 w-varr3             pic xxx");
    expect(5).to.equal(variable.getLevel());
    expect("w-varr3").to.equal(variable.getName());
    expect(Type.Alphanumeric).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
    //
    variable = CobolVariable.parseLine("05 w-var               pic is 999,99 ");
    expect(5).to.equal(variable.getLevel());
    expect("w-var").to.equal(variable.getName());
    expect(Type.Decimal).to.equal(variable.getType());
    expect(false).to.equal(variable.isAllowNegative());
    expect(true).to.equal(variable.isDisplay());
  });

});
