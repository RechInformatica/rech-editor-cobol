import { expect } from 'chai';
import 'mocha';
import { MethodCallUtils } from '../../../lsp/declaration/MethodCallUtils';

describe('MethodCallUtils functions', () => {

  it('Checks whether line text represents a method call', () => {
    expect(MethodCallUtils.isMethodCall("myObject:>method", 13)).to.equal(true);
    expect(MethodCallUtils.isMethodCall("myObject:>method", 11)).to.equal(true);
    expect(MethodCallUtils.isMethodCall("myObject:>method", 10)).to.equal(true);
    expect(MethodCallUtils.isMethodCall("myObject:>method", 9)).to.equal(false);
    expect(MethodCallUtils.isMethodCall("myObject:>method", 8)).to.equal(false);
    expect(MethodCallUtils.isMethodCall("myObject:>method", 5)).to.equal(false);
    expect(MethodCallUtils.isMethodCall("           if self:>getProviderId = w78-client-provider", 18)).to.equal(false);
  });

});
