import { expect } from 'chai';
import 'mocha';
import { CobolWordFinder } from '../../commons/CobolWordFinder';

    describe('Cobol word finder', () => {

        it('Checks cobol word at the first move variable', () => {
            expect("w-idv").to.equal(new CobolWordFinder().findWordAt("move w-idv to w-adv", 6));
        });
        it('Checks cobol word at the second move variable', () => {
            expect("w-adv").to.equal(new CobolWordFinder().findWordAt("move w-idv to w-adv", 17));
        });
        it('Checks cobol word at the first move variable with index', () => {
            expect("w-var").to.equal(new CobolWordFinder().findWordAt("move w-var(w-idx) to w-adv", 6));
        });
        it('Checks cobol word at the first index of move variable with index', () => {
            expect("w-idx").to.equal(new CobolWordFinder().findWordAt("move w-var(w-idx) to w-adv", 14));
        });
        it('Checks cobol word with index at the first move variable with index', () => {
            expect("w-var(w-idx)").to.equal(new CobolWordFinder().findWordWithIndexAt("move w-var(w-idx) to w-adv", 14));
        });
        it('Checks cobol word with index at the first move variable with index', () => {
            expect("w-var(w-idx)").to.equal(new CobolWordFinder().findWordWithIndexAt("move w-var(w-idx) to w-adv", 14));
        });
        it('Checks cobol word at the second move variable, but only the first variable contains index', () => {
            expect("w-adv").to.equal(new CobolWordFinder().findWordWithIndexAt("move w-var(w-idx) to w-adv", 24));
        });

    });