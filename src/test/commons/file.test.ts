import { assert } from 'chai';
import 'mocha';
import { File } from '../../commons/file'
import { reject } from 'q';

describe('New File Function', () => {

  // Try create a new file
  it('Create a new file', (done) => {
    let fileName = "C:\\tmp\\teste_file_vscode.txt";
    var result = new File(fileName).saveBuffer(["Teste", "123"]);
    result.then(() => {
      assert.isTrue(new File(fileName).exists());
      done();
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Try write and read a file in latin1
  it('Write and read a file in latin1', (done) => {
    let fileName = "C:\\tmp\\teste_file_vscode.txt";
    let buffer = ["Teste", "123", "Grêmio"]
    var result = new File(fileName).saveBuffer(buffer, "latin1");
    result.then(() => {
      new File(fileName).loadBuffer("latin1").then((b) => {
        assert.equal(buffer, b);
        done();
      }).catch(() => {
        reject();
      });
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });

  // Try write and read a file in UTF-8
  it('Write and read a file in UTF-8', (done) => {
    let fileName = "C:\\tmp\\teste_file_vscode.txt";
    let buffer = ["Teste", "123", "Grêmio"]
    var result = new File(fileName).saveBuffer(buffer, "UTF-8");
    result.then(() => {
      new File(fileName).loadBuffer("latin1").then((b) => {
        assert.equal(buffer, b);
        done();
      }).catch(() => {
        reject();
      });
    }).catch((e) => {
      assert.fail(e);
      done();
    });
  });
  
});