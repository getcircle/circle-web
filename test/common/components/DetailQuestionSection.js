import expect from 'expect';
import React from 'react';

import DetailQuestionSection from '../../../src/common/components/DetailQuestionSection';
import RoundedButton from '../../../src/common/components/RoundedButton';

const BUTTON_TEXT = 'BUTTON';
const QUESTION_TEXT = 'QUESTION';

const setup = buildSetup(DetailQuestionSection, () => {
    return {
        buttonText: BUTTON_TEXT,
        onTouchTap: expect.createSpy(),
        questionText: QUESTION_TEXT,
    };
});

describe('DetailQuestionSection', () => {

    it('renders the provided question text', () => {
        const { wrapper } = setup();
        expect(wrapper.find('div').text()).toEqual(QUESTION_TEXT);
    });

    it('renders the provided button text', () => {
        const { wrapper } = setup();
        expect(wrapper.find(RoundedButton).prop('label')).toEqual(BUTTON_TEXT);
    });

    it('renders a header if provided', () => {
        const header = <span/>;
        const { wrapper } = setup({header});
        expect(wrapper.contains(header)).toBe(true);
    });

    describe('onTouchTap of the button', () => {

        it('calls the onTouchTap prop', () => {
            const { wrapper, props } = setup();
            wrapper.find(RoundedButton).prop('onTouchTap')();
            expect(props.onTouchTap).toHaveBeenCalled();
        });

    });

});
