import expect from 'expect';

const RED_BORDER = '1px solid rgba(200, 0, 0, 0.8)';

export function itDoesNotShowError(wrapper) {
    it('is not highlighted in red', () => {
        expect(wrapper.prop('style').border).toNotBe(RED_BORDER);
    });
}

export function itShowsError(wrapper) {
    it('is highlighted in red', () => {
        expect(wrapper.prop('style').border).toBe(RED_BORDER);
    });
}
