import expect from 'expect';

const RED_BORDER = '1px solid rgba(200, 0, 0, 0.8)';

export function itDoesNotShowError(output) {
    it('is not highlighted in red', () => {
        const input = output.props.children[0];
        expect(input.props.style.border).toNotBe(RED_BORDER);
    });
}

export function itShowsError(output) {
    it('is highlighted in red', () => {
        const input = output.props.children[0];
        expect(input.props.style.border).toBe(RED_BORDER);
    });
}
