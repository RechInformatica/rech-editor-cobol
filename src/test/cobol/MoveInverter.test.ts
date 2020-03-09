import { expect } from 'chai';
import 'mocha';
import { MoveInverter } from '../../cobol/MoveInverter';

describe('Move inverter', () => {

    it('Inverts move operators', () => {
        const current =
            '        move    jres-ef-ni-qrs to ki-xqrs,\n' +
            '        move    ki-xqtg(w-i4d) to ki-xqrs,\n' +
            '        move    ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d),\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d),\n' +
            '        move    jres-ef-ni-qrs to ki-xqrs\n' +
            '        move    ki-xqtg(w-i4d) to ki-xqrs\n' +
            '        move    ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d),\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d),\n' +
            '        move    jres-ef-ni-qrs to ki-xqrs. *> Inline comment\n' +
            '        move    ki-xqtg(w-i4d) to ki-xqrs.\n' +
            '        move    ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d).\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d).\n' +
            '        move    jres-ef-ni-qrs to ki-xqrs.\n' +
            '        move    ki-xqtg(w-i4d) to ki-xqrs.\n' +
            '        move    ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d).\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d).\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-abc, w-def).\n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-abc, w-def)   *>   Another comment   \n' +
            '        move    wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-abc, w-def),';
        const expected =
            '        move ki-xqrs to jres-ef-ni-qrs,\n' +
            '        move ki-xqrs to ki-xqtg(w-i4d),\n' +
            '        move wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d),\n' +
            '        move ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d),\n' +
            '        move ki-xqrs to jres-ef-ni-qrs\n' +
            '        move ki-xqrs to ki-xqtg(w-i4d)\n' +
            '        move wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d),\n' +
            '        move ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d),\n' +
            '        move ki-xqrs to jres-ef-ni-qrs. *> Inline comment\n' +
            '        move ki-xqrs to ki-xqtg(w-i4d).\n' +
            '        move wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d).\n' +
            '        move ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d).\n' +
            '        move ki-xqrs to jres-ef-ni-qrs.\n' +
            '        move ki-xqrs to ki-xqtg(w-i4d).\n' +
            '        move wni-qtgres(w-iit, w-i4d) to ki-xqtg(w-i4d).\n' +
            '        move ki-xqtg(w-i4d) to wni-qtgres(w-iit, w-i4d).\n' +
            '        move ki-xqtg(w-abc, w-def) to wni-qtgres(w-iit, w-i4d).\n' +
            '        move ki-xqtg(w-abc, w-def) to wni-qtgres(w-iit, w-i4d)   *>   Another comment   \n' +
            '        move ki-xqtg(w-abc, w-def) to wni-qtgres(w-iit, w-i4d),';
        const result = new MoveInverter().invertOperators(current);
        expect(expected).to.equal(result);
    });
});