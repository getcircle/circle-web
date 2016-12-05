//import expect from 'expect';
//import ReactDOM from 'react-dom';
//import React from 'react';
//import { services } from 'protobufs';
//import TestUtils from 'react-addons-test-utils';

//import AutogrowTextarea from '../../../src/common/components/AutogrowTextarea';
//import Post from '../../../src/common/components/Post';

//import componentWithContext from '../../componentWithContext';
//import AuthContextFactory from '../../factories/AuthContextFactory';
//import PostFactory from '../../factories/PostFactory';
//import ProfileFactory from '../../factories/ProfileFactory';

//const { PostStateV1 } = services.post.containers;

//function setup(propsOverrides, adminProfile) {

    //// Props
    //const defaultProps = {
        //onSaveCallback: expect.createSpy(),
        //post: PostFactory.getPostWithTitleAndContent('', ''),
    //}
    //const props = Object.assign({}, defaultProps, propsOverrides);

    //let contextOverrides;
    //if (typeof adminProfile !== 'undefined') {
        //contextOverrides = {
            //auth: AuthContextFactory.getContext(undefined, undefined, adminProfile),
        //};
    //}

    //const Container = componentWithContext(<Post {...props} />, contextOverrides);
    //let container = TestUtils.renderIntoDocument(<Container />);
    //const postComponent = TestUtils.findRenderedComponentWithType(container, Post);
    //return {
        //postComponent,
        //props,
        //container,
    //};
//}

//describe('PostComponent', () => {

    //describe('readonlyContent', () => {

        //it('does not add any input elements when viewing body', () => {
            //const { postComponent } = setup({isEditable: false});
            //let textareas = TestUtils.scryRenderedComponentsWithType(postComponent, AutogrowTextarea);
            //expect(textareas.length).toBe(0);
        //});

        //it('detects URLs and emails in readonly content and adds markup', () => {
            //const postContent = 'This is a sample post content. For more details checkout - https://lunohq.com ' +
            //'If you have any questions, contact ravi@lunohq.com or michael@lunohq.com';
            //const { postComponent } = setup({
                //isEditable: false,
                //post: PostFactory.getPostWithTitleAndContent('', postContent),
            //});

            //const postContentComponent = TestUtils.findRenderedDOMComponentWithClass(postComponent, 'luno-editor');
            //expect(TestUtils.isDOMComponent(postContentComponent)).toBe(true);

            //expect((ReactDOM.findDOMNode(postContentComponent)).innerHTML).toBe(
                //'This is a sample post content. For more details checkout - ' +
                //'<a href="https://lunohq.com" target="_blank">https://lunohq.com</a> ' +
                //'If you have any questions, contact <a href="mailto:ravi@lunohq.com">ravi@lunohq.com</a> or ' +
                //'<a href="mailto:michael@lunohq.com">michael@lunohq.com</a>'
            //);
        //});

    //});

    //describe('when editingContent', () => {

        //// XXX: Need to figure out how to test Trix editor wrapper.

        //// it('correctly returns current title', () => {
        ////     const { postComponent } = setup({
        ////         isEditable: true,
        ////     });

        ////     const testTitle = 'This is a test title';
        ////     const textarea = TestUtils.findRenderedComponentWithType(postComponent, AutogrowTextarea);

        ////     const titleInput = ReactDOM.findDOMNode(textarea.refs.input);
        ////     titleInput.value = testTitle;
        ////     TestUtils.Simulate.change(titleInput);
        ////     expect(postComponent.getCurrentTitle()).toBe(testTitle);
        //// });

        //// it('has input areas for title', () => {
        ////     const { postComponent } = setup({isEditable: true});
        ////     const textarea = TestUtils.findRenderedComponentWithType(postComponent, AutogrowTextarea);
        ////     expect(textarea).toExist();
        //// });

        //it('adds title from body if its not set', () => {
            //const { postComponent } = setup();
            //const testTitle = 'This is a test body body with title as the first line';
            //const testBody = testTitle + '. Actual body starts here.';

            //postComponent.handleBodyChange({}, testBody);
            //expect(postComponent.state.title).toBe(testTitle);
            //expect(postComponent.state.body).toBe(testBody);
            //expect(postComponent.state.editing).toBe(true);
            //expect(postComponent.state.derivedTitle).toBe(true);
        //});

        //it('does not allows changing owner if post is in draft state', () => {
            //const adminProfile = ProfileFactory.getAdminProfile();
            //const { postComponent, props } = setup({
                //autoSave: false,
                //isEditable: true,
            //}, adminProfile);

            //expect(props.post.state).toBe(PostStateV1.DRAFT);
            //expect(postComponent.shouldAllowChangingOwner()).toBe(false);
            //expect(adminProfile.is_admin).toBe(true);
        //});

        //it('does not allows changing owner if logged in user is not an admin user', () => {
            //const { postComponent, props } = setup({
                //autoSave: false,
                //isEditable: true,
                //post: PostFactory.getPostWithState(PostStateV1.LISTED),
            //});

            //expect(postComponent.shouldAllowChangingOwner()).toBe(false);
            //expect(props.post.state).toBe(PostStateV1.LISTED);
        //});

        //it('allows changing owner if logged in user is an admin user and post is published', () => {
            //const adminProfile = ProfileFactory.getAdminProfile();
            //const { postComponent, props } = setup({
                //autoSave: false,
                //isEditable: true,
                //post: PostFactory.getPostWithState(PostStateV1.LISTED),
            //}, adminProfile);

            //expect(postComponent.shouldAllowChangingOwner()).toBe(true);
            //expect(props.post.state).toBe(PostStateV1.LISTED);
            //expect(adminProfile.is_admin).toBe(true);
        //});

    //});

//});
