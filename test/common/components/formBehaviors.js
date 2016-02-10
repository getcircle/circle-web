import expect from 'expect';

import { getCustomTheme } from '../../../src/common/styles/theme';

const theme = getCustomTheme(global.navigator.userAgent);
const redBorder = theme.luno.form.fieldError.border;

export function itDoesNotShowError(wrapper) {
    it('is not highlighted in red', () => {
        expect(wrapper.prop('style').border).toNotBe(redBorder);
    });
}

export function itShowsError(wrapper) {
    it('is highlighted in red', () => {
        expect(wrapper.prop('style').border).toBe(redBorder);
    });
}
