import { assert } from "chai";
import "mocha";
import * as path from "path";
import { Scan } from "../../commons/Scan";
import { File } from "../../commons/file";
import { Path } from "../../commons/path";

describe("Buffer scan functions", () => {
  // Test scan the buffer
  it("Scan the buffer", done => {
    new File(new Path(path.resolve(__dirname) + "/../TestFiles/PROCEDURE.CBL").fullPath()).loadBuffer("latin1").then(buffer => {
      let term = "PLIS-ACESEL";
      new Scan(buffer).scan(new RegExp(term, "gi"), (iterator: any) => {
        if (iterator.lineContent.includes(term)) {
          assert.equal(34, iterator.column);
          assert.equal(9, iterator.row + 1);
          iterator.stop();
        }
      });
      done();
    });
  });
});
