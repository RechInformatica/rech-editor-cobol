import { expect } from 'chai';
import 'mocha';
import * as path from "path";
import { CobolVariable, Type } from '../../../lsp/completion/CobolVariable';
import { File } from '../../../commons/file';
import { Path } from '../../../commons/path';
import { BufferSplitter } from 'rech-ts-commons';

describe('Cobol variable declaration parser test', () => {

    it('Check Cobol variable parsing level 05', () => {
        const line = "           05 w-var               pic is 9(100) ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           05 w-var               pic is 9(100) ").to.equal(variable.getRaw());
        expect("9(100)").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing level 10', () => {
        const line = "           10 w-var               pic is 9(100) ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 9(100) ").to.equal(variable.getRaw());
        expect("9(100)").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic 9(100)v99', () => {
        const line = "           10 w-var               pic is 9(100)v9 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 9(100)v9 ").to.equal(variable.getRaw());
        expect("9(100)v9").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic 99v99', () => {
        const line = "           10 w-var               pic is 99v99 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is 99v99 ").to.equal(variable.getRaw());
        expect("99v99").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic s99v99', () => {
        const line = "           10 w-var               pic is s99v99 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is s99v99 ").to.equal(variable.getRaw());
        expect("s99v99").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic -99', () => {
        const line = "        05 w-var                  pic is -99 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("        05 w-var                  pic is -99 ").to.equal(variable.getRaw());
        expect("-99").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing level 10 pic is -99', () => {
        const line = "           10 w-var               pic is -99 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is -99 ").to.equal(variable.getRaw());
        expect("-99").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic is zz9', () => {
        const line = "           10 w-var               pic is zz9 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic is zz9 ").to.equal(variable.getRaw());
        expect("zz9").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic zz9', () => {
        const line = "           10 w-var               pic zz9 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("           10 w-var               pic zz9 ").to.equal(variable.getRaw());
        expect("zz9").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic -bbbbb', () => {
        const line = "25 MINHA-VARIAVEL               pic -bbbbb ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(25).to.equal(variable.getLevel());
        expect("MINHA-VARIAVEL").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(true).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("25 MINHA-VARIAVEL               pic -bbbbb ").to.equal(variable.getRaw());
        expect("-bbbbb").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic 9(100)v9', () => {
        const line = "           10 w-var               PIC 9(100)v9";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("           10 w-var               PIC 9(100)v9").to.equal(variable.getRaw());
        expect("9(100)v9").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic xxx value spaces', () => {
        const line = "05 w-varr3             pic xxx         value is spaces.";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-varr3").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-varr3             pic xxx         value is spaces.").to.equal(variable.getRaw());
        expect("xxx").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic xxx', () => {
        const line = "05 w-varr3             pic xxx";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-varr3").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-varr3             pic xxx").to.equal(variable.getRaw());
        expect("xxx").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic 999,99', () => {
        const line = "05 w-var               pic is 999,99 ";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-var").to.equal(variable.getName());
        expect(Type.Decimal).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-var               pic is 999,99 ").to.equal(variable.getRaw());
        expect("999,99").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic is 99/99/9999 values is zeros', () => {
        const line = "05 w-data              pic is 99/99/9999 value is zeros.";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("w-data").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 w-data              pic is 99/99/9999 value is zeros.").to.equal(variable.getRaw());
        expect("99/99/9999").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing pic is 9(02).', () => {
        const line = "10 w-dia            pic is 9(02).";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(10).to.equal(variable.getLevel());
        expect("w-dia").to.equal(variable.getName());
        expect(Type.Integer).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(false).to.equal(variable.isDisplay());
        expect("10 w-dia            pic is 9(02).").to.equal(variable.getRaw());
        expect("9(02)").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing goup item', () => {
        const line = "01  wrk-campos.";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(1).to.equal(variable.getLevel());
        expect("wrk-campos").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("01  wrk-campos.").to.equal(variable.getRaw());
        expect("").to.equal(variable.getPicture());
    });
    it('Check Cobol variable parsing redefines', () => {
        const line = "05 filler    redefines w-data.";
        const variable = CobolVariable.parseLines(0, [line]);
        expect(5).to.equal(variable.getLevel());
        expect("filler").to.equal(variable.getName());
        expect(Type.Alphanumeric).to.equal(variable.getType());
        expect(false).to.equal(variable.isAllowNegative());
        expect(true).to.equal(variable.isDisplay());
        expect("05 filler    redefines w-data.").to.equal(variable.getRaw());
        expect("").to.equal(variable.getPicture());
    });

});

describe('Cobol variable children parser test', () => {

    const lines = BufferSplitter.split(new File(new Path(path.resolve(__dirname) + "/../../TestFiles/WORKING.CBL").fullPath()).loadBufferSync("latin1"))
    //
    it('Check Cobol variable children parsing level 78', () => {
        const line = 15
        const variable = CobolVariable.parseLines(line, lines);
        expect(0).to.equal(variable.getChildren()!.length);
    });
    it('Check Cobol variable children parsing only child', () => {
        const line = 17
        const variable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(variable.getChildren()!.length);
        expect("w-filho-unico").to.equal(variable.getChildren()![0].getName());
        expect("9(06)V99comp-x").to.equal(variable.getChildren()![0].getPicture());
        expect("           05 w-filho-unico       pic is 9(06)V99 value is zeros comp-x.").to.equal(variable.getChildren()![0].getRaw());
    });
    it('Check Cobol variable children parsing dad', () => {
        const line = 21
        const variable = CobolVariable.parseLines(line, lines);
        expect(4).to.equal(variable.getChildren()!.length);
        //
        let children = variable.getChildren()![0];
        expect("w-filho-numerico").to.equal(children.getName());
        expect("9(06)V99").to.equal(children.getPicture());
        expect("           05 w-filho-numerico    pic is 9(06)V99 value is zeros.").to.equal(children.getRaw());
        //
        children = variable.getChildren()![1];
        expect("w-filho-picx").to.equal(children.getName());
        expect("xxx").to.equal(children.getPicture());
        expect("           05 w-filho-picx        pic is xxx      value is space.").to.equal(children.getRaw());
        //
        children = variable.getChildren()![2];
        expect("w-filho-pai-oito-oito").to.equal(children.getName());
        expect("x(01)").to.equal(children.getPicture());
        expect("           05 w-filho-pai-oito-oito pic is x(01)  value is \"F\".").to.equal(children.getRaw());
        //
        expect(3).to.equal(children.getChildren()!.length);
        let grandson = children.getChildren()![0]
        expect("filho-pai-oito-oito-pri").to.equal(grandson.getName());
        expect("              88 filho-pai-oito-oito-pri          value is \"P\".").to.equal(grandson.getRaw());
        //
        grandson = children.getChildren()![1]
        expect("filho-pai-oito-oito-seg").to.equal(grandson.getName());
        expect("              88 filho-pai-oito-oito-seg          value is \"S\".").to.equal(grandson.getRaw());
        //
        grandson = children.getChildren()![2]
        expect("filho-pai-oito-oito-ter").to.equal(grandson.getName());
        expect("              88 filho-pai-oito-oito-ter          value is \"T\".").to.equal(grandson.getRaw());
        //
        children = variable.getChildren()![3];
        expect("w-filho-com-filho").to.equal(children.getName());
        expect("").to.equal(children.getPicture());
        expect("           05 w-filho-com-filho.").to.equal(children.getRaw());
        //
        grandson = children.getChildren()![0]
        expect("w-neto").to.equal(grandson.getName());
        expect("xxx").to.equal(grandson.getPicture());
        expect("              10 w-neto           pic is xxx      value is space.").to.equal(grandson.getRaw());
    });
    it('Check Cobol variable children parsing no child', () => {
        const line = 44
        const variable = CobolVariable.parseLines(line, lines);
        expect(0).to.equal(variable.getChildren()!.length);
    });
    it('Check Cobol variable children parsing level 77', () => {
        const line = 46
        const variable = CobolVariable.parseLines(line, lines);
        expect(0).to.equal(variable.getChildren()!.length);
    });
});

describe('Cobol variable get length test', () => {

    const lines = new File(new Path(path.resolve(__dirname) + "/../../TestFiles/WORKING.CBL").fullPath()).loadBufferSync("latin1").split("\r\n")
    it('Check Cobol group item variable byte size test', () => {
        const line = 49
        const valiable = CobolVariable.parseLines(line, lines);
        expect(40).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable dad of pic 9', () => {
        const line = 53
        const valiable = CobolVariable.parseLines(line, lines);
        expect(64).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9V9', () => {
        const line = 74
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9(1)V9', () => {
        const line = 75
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9V9(1)', () => {
        const line = 76
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9(2)V99', () => {
        const line = 77
        const valiable = CobolVariable.parseLines(line, lines);
        expect(2).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9(7)V9(03)', () => {
        const line = 78
        const valiable = CobolVariable.parseLines(line, lines);
        expect(5).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 999V9(03)', () => {
        const line = 79
        const valiable = CobolVariable.parseLines(line, lines);
        expect(3).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9(5)V999', () => {
        const line = 80
        const valiable = CobolVariable.parseLines(line, lines);
        expect(4).to.equal(valiable.getByteSize());
    });

    it('Check Cobol variable pic s9(2)V99', () => {
        const line = 81
        const valiable = CobolVariable.parseLines(line, lines);
        expect(2).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic s999V9(03)', () => {
        const line = 82
        const valiable = CobolVariable.parseLines(line, lines);
        expect(3).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic s9(5)V999', () => {
        const line = 83
        const valiable = CobolVariable.parseLines(line, lines);
        expect(4).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic s9(7)V9(03)', () => {
        const line = 84
        const valiable = CobolVariable.parseLines(line, lines);
        expect(5).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic Ocurs', () => {
        const line = 85
        const valiable = CobolVariable.parseLines(line, lines);
        expect(36).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable dad of display', () => {
        const line = 88
        const valiable = CobolVariable.parseLines(line, lines);
        expect(31).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic zzz999', () => {
        const line = 89
        const valiable = CobolVariable.parseLines(line, lines);
        expect(6).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic zzz.999', () => {
        const line = 90
        const valiable = CobolVariable.parseLines(line, lines);
        expect(7).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic zzz,999', () => {
        const line = 91
        const valiable = CobolVariable.parseLines(line, lines);
        expect(7).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic -99,99', () => {
        const line = 92
        const valiable = CobolVariable.parseLines(line, lines);
        expect(6).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic -9999', () => {
        const line = 93
        const valiable = CobolVariable.parseLines(line, lines);
        expect(5).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic x(10) no value', () => {
        const line = 94
        const valiable = CobolVariable.parseLines(line, lines);
        expect(10).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic x(01) no value', () => {
        const line = 95
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic x no value', () => {
        const line = 96
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9 no value', () => {
        const line = 97
        const valiable = CobolVariable.parseLines(line, lines);
        expect(1).to.equal(valiable.getByteSize());
    });
    it('Check Cobol variable pic 9(10) no value', () => {
        const line = 98
        const valiable = CobolVariable.parseLines(line, lines);
        expect(10).to.equal(valiable.getByteSize());
    });
    it('Check size of variable without redefines clause', () => {
        const line = 100
        const valiable = CobolVariable.parseLines(line, lines);
        expect(20).to.equal(valiable.getByteSize());
    });
    it('Check size of variable with redefines clause', () => {
        const line = 101
        const valiable = CobolVariable.parseLines(line, lines);
        expect(20).to.equal(valiable.getByteSize());
    });
    it('Check size of variable with redefines clause but ignoring redefined value', () => {
        const line = 101
        const valiable = CobolVariable.parseLines(line, lines);
        expect(0).to.equal(valiable.getByteSizeIgnoringRedefines());
    });
    it('Check size of parent variable with redefines of children elements', () => {
        const line = 102
        const valiable = CobolVariable.parseLines(line, lines);
        expect(30).to.equal(valiable.getByteSize());
    });
});