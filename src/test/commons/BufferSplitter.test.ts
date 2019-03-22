import "mocha";
import { expect } from 'chai';
import { BufferSplitter } from "../../commons/BufferSplitter";

describe("Buffer splitter functions", () => {
  it("Splits buffer containing only \\r\\n lines", async () => {
    let buffer = "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
      "      *>                                                Calcula o ICMS                                                <*\r\n" +
      "      *>--------------------------------------------------------------------------------------------------------------<*\r\n" +
      "       configuration              section.\r\n" +
      "      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*";
    let splitted = BufferSplitter.split(buffer);
    expect(splitted.length).to.equal(5);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[0]);
    expect("      *>                                                Calcula o ICMS                                                <*").to.equal(splitted[1]);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[2]);
    expect("       configuration              section.").to.equal(splitted[3]);
    expect("      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*").to.equal(splitted[4]);
    for (let i = 0; i < splitted.length; i++) {
      expect(false).to.equal(splitted[i].includes("\r"));
      expect(false).to.equal(splitted[i].includes("\n"));
    };
  });

  it("Splits buffer containing only \\r lines", async () => {
    let buffer = "      *>--------------------------------------------------------------------------------------------------------------<*\r" +
      "      *>                                                Calcula o ICMS                                                <*\r" +
      "      *>--------------------------------------------------------------------------------------------------------------<*\r" +
      "       configuration              section.\r" +
      "      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*";
    let splitted = BufferSplitter.split(buffer);
    expect(splitted.length).to.equal(5);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[0]);
    expect("      *>                                                Calcula o ICMS                                                <*").to.equal(splitted[1]);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[2]);
    expect("       configuration              section.").to.equal(splitted[3]);
    expect("      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*").to.equal(splitted[4]);
    for (let i = 0; i < splitted.length; i++) {
      expect(false).to.equal(splitted[i].includes("\r"));
      expect(false).to.equal(splitted[i].includes("\n"));
    };
  });

  it("Splits buffer containing only \\n lines", async () => {
    let buffer = "      *>--------------------------------------------------------------------------------------------------------------<*\n" +
      "      *>                                                Calcula o ICMS                                                <*\n" +
      "      *>--------------------------------------------------------------------------------------------------------------<*\n" +
      "       configuration              section.\n" +
      "      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*";
    let splitted = BufferSplitter.split(buffer);
    expect(splitted.length).to.equal(5);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[0]);
    expect("      *>                                                Calcula o ICMS                                                <*").to.equal(splitted[1]);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[2]);
    expect("       configuration              section.").to.equal(splitted[3]);
    expect("      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*").to.equal(splitted[4]);
    for (let i = 0; i < splitted.length; i++) {
      expect(false).to.equal(splitted[i].includes("\r"));
      expect(false).to.equal(splitted[i].includes("\n"));
    };
  });

  it("Splits buffer containing mixed \\r and \\n lines", async () => {
    let buffer = "      *>--------------------------------------------------------------------------------------------------------------<*\r" +
      "      *>                                                Calcula o ICMS                                                <*\n" +
      "      *>--------------------------------------------------------------------------------------------------------------<*\r" +
      "       configuration              section.\r\n" +
      "      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*";
    let splitted = BufferSplitter.split(buffer);
    expect(splitted.length).to.equal(5);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[0]);
    expect("      *>                                                Calcula o ICMS                                                <*").to.equal(splitted[1]);
    expect("      *>--------------------------------------------------------------------------------------------------------------<*").to.equal(splitted[2]);
    expect("       configuration              section.").to.equal(splitted[3]);
    expect("      *>--------------------------------------------- CALICM.cbl -----------------------------------------------------<*").to.equal(splitted[4]);
    for (let i = 0; i < splitted.length; i++) {
      expect(false).to.equal(splitted[i].includes("\r"));
      expect(false).to.equal(splitted[i].includes("\n"));
    };
  });
});
