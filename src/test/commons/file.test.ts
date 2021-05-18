import { assert } from "chai";
import "mocha";
import { File } from "../../commons/file"
import { FileUtils } from "../../commons/FileUtils";

describe("File Functions", () => {

  // Try create a new file
  it("Create a new file", (done) => {
    const fileName = "C:\\tmp\\teste_file_vscode.txt";
    const result = new File(fileName).saveBuffer(Buffer.from(["Teste", "123"]));
    result.then(() => {
      assert.isTrue(new File(fileName).exists());
      done();
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Try write and read a file in latin1
  it("Write and read a file in latin1", (done) => {
    const fileName = "C:\\tmp\\teste_file_vscode.txt";
    const buffer = Buffer.from(["Teste", "123", "àáÍíÉÓôÔãâÃ", "-_?=[]{}()/\\|.;,"]);
    const result = new File(fileName).saveBuffer(buffer, "latin1");
    result.then(() => {
      FileUtils.read(fileName, "latin1").then((b) => {
        assert.equal(buffer.toString(), b);
        done();
      }).catch();
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Try write and read a file in UTF-8
  it("Write and read a file in UTF-8", (done) => {
    const fileName = "C:\\tmp\\teste_file_vscode.txt";
    const buffer = Buffer.from(["Teste", "123", "àáÍíÉÓôÔãâÃ", "-_?=[]{}()/\\|.;,"]);
    const result = new File(fileName).saveBuffer(buffer, "UTF-8");
    result.then(() => {
      FileUtils.read(fileName, "UTF-8").then((b) => {
        assert.equal(buffer.toString(), b);
        done();
      }).catch();
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Test to append content in a file
  it("Append content in a file", (done) => {
    const file = File.tmpFile();
    const buffer = [["123"], ["àáÍíÉÓôÔãâÃ"], ["-_?=[]{}()/\\|.; "]]
    file.appendBuffer(Buffer.from(buffer[0]), "latin1").then(() => {
      file.appendBuffer(Buffer.from(buffer[1]), "latin1").then(() => {
        file.appendBuffer(Buffer.from(buffer[2]), "latin1").then(() => {
          file.loadBuffer("latin1").then((b) => {
            assert.equal(b, buffer.toString().replace(/,/g, ""));
            done();
          }).catch((e) => {
            assert.fail(e);
            done();
          });
        }).catch((e) => {
          assert.fail(e);
          done();
        });
      }).catch((e) => {
        assert.fail(e);
        done();
      });
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Try delete a file
  it("Delete a file", (done) => {
    const file = new File("C:\\tmp\\teste_file_vscode.txt");
    const buffer = Buffer.from(["Teste", "123", "àáÍíÉÓôÔãâÃ", "-_?=[]{}()/\\|.;,"]);
    const result = file.saveBuffer(buffer, "UTF-8");
    result.then(() => {
      file.delete();
      assert.isFalse(new File(file.fileName).exists());
      done();
    }).catch(() => {});
  });

  // Try copy a file
  it("Copy a file", (done) => {
    const file = new File("C:\\teste_file_vscode.txt");
    const dest = new File("C:\\tmp\\teste_file_vscode.txt");
    if (dest.exists()) {
      dest.delete();
    }
    const buffer = Buffer.from("Teste");
    const result = file.saveBuffer(buffer, "UTF-8");
    result.then(() => {
      file.copy(dest.fileName, () => {
        assert.isTrue(dest.exists());
        done();
      });
    }).catch(() => {});
  });

});
