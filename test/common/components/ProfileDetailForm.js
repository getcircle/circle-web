import expect from 'expect';
import { initialize } from 'redux-form';
import { shallow } from 'enzyme';
import React from 'react';
import { services } from 'protobufs';

import { getProfile } from '../../factories/ProfileFactory';
import { hideModal, updateProfile } from '../../../src/common/actions/profiles';
import { PROFILE_DETAIL } from '../../../src/common/constants/forms';
import { ProfileDetailForm, fieldNames, getUpdatedProfile } from '../../../src/common/components/ProfileDetailForm';
import FormDialog from '../../../src/common/components/FormDialog';
import { uploadMedia } from '../../../src/common/actions/media';

const { MediaTypeV1 } = services.media.containers.media;

function setup(overrides) {
    const defaults = {
        contactMethods: [],
        dispatch: expect.createSpy(),
        fields: {
            bio: {onChange: expect.createSpy(), value: ''},
            contacts: [],
            email: {onChange: expect.createSpy(), value: ''},
            firstName: {onChange: expect.createSpy(), value: ''},
            lastName: {onChange: expect.createSpy(), value: ''},
            manager: {onChange: expect.createSpy(), value: {}},
            photo: {onChange: expect.createSpy(), value: {}},
            title: {onChange: expect.createSpy(), value: ''},
        },
        formSubmitting: false,
        handleSubmit: () => expect.createSpy(),
        mediaUrl: '',
        onSaveCallback: expect.createSpy(),
        profile: getProfile(),
        resetForm: expect.createSpy(),
        visible: false,
    };
    const props = Object.assign({}, defaults, overrides);

    const wrapper = shallow(<ProfileDetailForm {...props} />);

    return {
        props,
        wrapper,
    };
}

function initializeAction(profile) {
    return initialize(PROFILE_DETAIL, {
        bio: profile.bio,
        contacts: [],
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        manager: undefined,
        photo: { existing: true, preview: profile.image_url },
        title: profile.title,
    }, fieldNames);
}

describe('ProfileDetailForm', () => {

    describe('mounting', () => {
        it('initializes the form with the provided profile', () => {
            const dispatchSpy = expect.createSpy();
            const profile = getProfile();
            setup({
                dispatch: dispatchSpy,
                profile: profile,
            });
            const action = initializeAction(profile);
            expect(dispatchSpy).toHaveBeenCalledWith(action);
        });
    });

    describe('visibility', () => {

        it('resets the form when the it becomes visible', () => {
            const resetFormSpy = expect.createSpy();
            const dispatchSpy = expect.createSpy();
            const profile = getProfile();
            const { wrapper } = setup({
                dispatch: dispatchSpy,
                profile: profile,
                resetForm: resetFormSpy,
            });
            dispatchSpy.reset();
            const action = initializeAction(profile);
            wrapper.setProps({visible: true});
            expect(dispatchSpy).toHaveBeenCalledWith(action);
            expect(resetFormSpy).toHaveBeenCalled('Should reset the form');
        });

    });

    describe('canceling', () => {

        it('dispatches the hide modal action', () => {
            const dispatchSpy = expect.createSpy();
            const { wrapper } = setup({dispatch: dispatchSpy});
            wrapper.find(FormDialog).prop('onCancel')();
            expect(dispatchSpy).toHaveBeenCalledWith(hideModal());
        });

    });

    describe('submitting', () => {

        it('dispatches the update profile action', () => {
            const profile = getProfile();
            const handleSubmit = (fn) => () => fn({
                photo: {existing: true},
            }, props.dispatch);
            const { wrapper, props } = setup({
                handleSubmit: handleSubmit,
                profile: profile,
            });
            wrapper.find(FormDialog).prop('onSubmit')();
            const action = updateProfile(profile, null);
            expect(props.dispatch).toHaveBeenCalledWith(action);
        });
    });

    describe('getUpdatedProfile', () => {

        it('returns a valid profile that can be used to instantiate a ProfileV1 protobuf', () => {
            const profile = getProfile();
            const { props } = setup({profile});
            const updatedProfile = getUpdatedProfile({fields: props.fields, profile: props.profile});
            new services.profile.containers.ProfileV1(updatedProfile);
        });

    });

});
