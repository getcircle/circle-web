import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';

import FormRecordList, { RecordWrapper } from '../../../src/common/components/FormRecordList';
import FormTextField from '../../../src/common/components/FormTextField';
import { getDefaultContext } from '../../componentWithContext';

const Record = ({record}) => {
    return (
        <div>
            <FormTextField
                {...record.name}
            />
        </div>
    );
};

function setup(overrides) {
    let records = [
        {name: {value: 'Bob'}},
        {name: {value: 'Fred'}},
    ];
    records.addField = expect.createSpy();
    records.removeField = expect.createSpy();

    const defaults = {
        component: Record,
        records: records,
    };
    const props = Object.assign({}, defaults, overrides);
    const context = getDefaultContext();

    const wrapper = shallow(<FormRecordList {...props} />, {context});

    return {
        props,
        wrapper,
    };
}

describe('FormRecordList', () => {

    it('renders a list of records', () => {
        const { wrapper } = setup();
        expect(wrapper.find(RecordWrapper).length).toBe(2);
    });

    it('adds records', () => {
        const { props: {records}, wrapper } = setup();
        wrapper.find('a').simulate('touchTap');
        expect(records.addField).toHaveBeenCalled();
    });

    it('removes records', () => {
        const { props: {records}, wrapper } = setup();
        wrapper.find(RecordWrapper).first().prop('onRemove')(1);
        expect(records.removeField).toHaveBeenCalledWith(1);
    });

});
