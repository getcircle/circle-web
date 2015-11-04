import expect from 'expect';
import React from 'react/addons';
import { services } from 'protobufs';

import Post from '../../src/components/Post';

const { TestUtils } = React.addons;

function setup(overrides) {
    const defaults = {
        onSaveCallback: expect.createSpy(),
    }
    const props = Object.assign({}, defaults, overrides);

    let output = TestUtils.renderIntoDocument(<Post {...props} />);
    return {
        props,
        output,
    };
}

describe('PostComponent', () => {

    it('calls onSaveCallback when saving explicitly', () => {
        const { output, props } = setup({autoSave: false});
        output.saveData(true);
        expect(props.onSaveCallback.calls.length).toBe(1);
    });

    it('adds explicit Publish button when editing a post', () => {
        const { output } = setup({
            autoSave: false,
            isEditable: true,
            post: new services.post.containers.PostV1({}),
        });

        expect(output.refs.publishButton).toExist();
    });

    describe('editingContent', () => {

        it('trims left title and body', () => {
            const { output } = setup();
            const testTitle = '    This is a test title';
            const testContent = '     This is a test body content';
            output.handleTitleChange({}, testTitle);
            expect(output.state.title).toBe(testTitle.trimLeft());

            output.handleBodyChange({}, testContent);
            expect(output.state.body).toBe(testContent.trimLeft());
        });

        it('adds title from body if its not set', () => {
            const { output } = setup();
            const testTitle = 'This is a test body content with title as the first line';
            const testContent = testTitle + '. Actual content starts here.';

            output.handleBodyChange({}, testContent);
            expect(output.state.title).toBe(testTitle);
            expect(output.state.body).toBe(testContent);
            expect(output.state.editing).toBe(true);
            expect(output.state.derivedTitle).toBe(true);
        });

    });

});
