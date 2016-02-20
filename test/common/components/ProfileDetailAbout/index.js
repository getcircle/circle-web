import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';
import { services } from 'protobufs';

import Bio from '../../../../src/common/components/ProfileDetailAbout/Bio';
import ContactMethods, { ContactMethod } from '../../../../src/common/components/ProfileDetailAbout/ContactMethods';
import DetailListProfiles from '../../../../src/common/components/DetailListProfiles';
import DetailListTeamMemberships from '../../../../src/common/components/DetailListTeamMemberships';
import DetailSection from '../../../../src/common/components/DetailSectionV2';
import EditButton from '../../../../src/common/components/ProfileDetailAbout/EditButton';
import Items from '../../../../src/common/components/ProfileDetailAbout/Items';
import ProfileDetailAbout, { DirectReports, Manager, Peers, Teams } from '../../../../src/common/components/ProfileDetailAbout';

import { getDefaultContext } from '../../../componentWithContext';
import ProfileFactory from '../../../factories/ProfileFactory';
import TeamFactory from '../../../factories/TeamFactory';

const { ContactMethodTypeV1 } = services.profile.containers.ContactMethodV1;

function setup(propsOverrides, Component = ProfileDetailAbout) {
    const profile = ProfileFactory.getProfile();
    const props = {
        dispatch: expect.createSpy(),
        isLoggedInUser: true,
        profile,
        ...propsOverrides,
    };
    const context = getDefaultContext();
    const wrapper = shallow(<Component {...props} />, { context });
    return {
        props,
        wrapper,
    };
}

describe('ProfileDetailAbout', () => {

    it('renders the "About" heading', () => {
        const { wrapper } = setup();
        expect(wrapper.find('h1').text()).toEqual('About');
    });

    describe('Bio', () => {

        it('renders if bio doesn\'t exist', () => {
            const { wrapper } = setup({profile: ProfileFactory.getProfile({bio: null})});
            expect(wrapper.find(Bio).length).toExist();
        });

        it('renders if the bio does exist', () => {
            const { wrapper } = setup();
            expect(wrapper.find(Bio).length).toExist();
        });

    });

    describe('Manager', () => {

        it('doesn\'t render the manager section if no manager exists', () => {
            const { wrapper } = setup();
            expect(wrapper.find(Manager).length).toNotExist();
        });

        it('renders the manager section if a manager exists', () => {
            const { wrapper, props } = setup({manager: ProfileFactory.getProfile()});
            expect(wrapper.find(Manager).length).toEqual(1);
            expect(wrapper.find(Manager).prop('profiles')).toEqual([props.manager]);
        });

        it('renders the manager in a list', () => {
            const { wrapper, props } = setup({profiles: [ProfileFactory.getProfile()]}, Manager)
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Manager');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
            expect(wrapper.find(DetailListProfiles).prop('profiles')).toEqual(props.profiles);
        });

    });

    describe('Peers', () => {

        it('doesn\'t render the peers section if no peers exist', () => {
            const { wrapper } = setup();
            expect(wrapper.find(Peers).length).toNotExist();
        });

        it('renders the peers section if peers exist', () => {
            const { wrapper, props } = setup({peers: ProfileFactory.getProfiles(3)});
            expect(wrapper.find(Peers).length).toEqual(1);
            expect(wrapper.find(Peers).prop('profiles')).toBe(props.peers);
        });

        it('renders the peers in a list', () => {
            const { wrapper, props } = setup({profiles: ProfileFactory.getProfiles(3)}, Peers);
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Peers');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
            expect(wrapper.find(DetailListProfiles).prop('profiles')).toEqual(props.profiles);
        });

    });

    describe('DirectReports', () => {

        it('doesn\'t render the peers section if no direct reports exist', () => {
            const { wrapper } = setup();
            expect(wrapper.find(DirectReports).length).toNotExist();
        });

        it('renders the direct reports section if peers exist', () => {
            const { wrapper, props } = setup({directReports: ProfileFactory.getProfiles(3)});
            expect(wrapper.find(DirectReports).length).toEqual(1);
            expect(wrapper.find(DirectReports).prop('profiles')).toEqual(props.directReports);
        });

        it('renders the peers in a list', () => {
            const { wrapper, props } = setup({profiles: ProfileFactory.getProfiles(3)}, DirectReports);
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Direct Reports');
            expect(wrapper.find(DetailListProfiles).length).toEqual(1);
            expect(wrapper.find(DetailListProfiles).prop('profiles')).toEqual(props.profiles);
        });

    });

    describe('ContactMethods', () => {

        it('renders the ContactMethods section if methods don\'t exist', () => {
            const { wrapper } = setup();
            expect(wrapper.find(ContactMethods).length).toExist();
        });

        it('renders the ContactMethods section if contact methods exist', () => {
            const { wrapper, props } = setup({profile: ProfileFactory.getProfileWithContactMethods([0])});
            expect(wrapper.find(ContactMethods).length).toExist();
            expect(wrapper.find(ContactMethods).prop('profile')).toBe(props.profile);
        });

        describe('no contact methods, not the current user', () => {

            it('renders "No info" text', () => {
                const { wrapper } = setup({isLoggedInUser: false}, ContactMethods);
                expect(wrapper.find('p').text()).toEqual('No info');
            });

            it('does not render a link to the edit profile modal', () => {
                const { wrapper } = setup({isLoggedInUser: false}, ContactMethods);
                expect(wrapper.find(EditButton).length).toBe(0);
            });

        });

        describe('no contact methods, current user', () => {

            it('renders a link to the edit profile modal', () => {
                const { wrapper } = setup();
                expect(wrapper.find(EditButton).length).toBe(1);
            });

        });

        it('renders contact methods in a list', () => {
            const { wrapper } = setup({profile: ProfileFactory.getProfileWithContactMethods([1, 1, 2])}, ContactMethods);
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Contact');
            expect(wrapper.find(ContactMethod).length).toEqual(3);
        });

    });

    describe('ContactMethod', () => {

        it('renders slack contact method', () => {
            /*eslint-disable camelcase*/
            const method = ProfileFactory.getProfileContactMethod({contact_method_type: ContactMethodTypeV1.SLACK});
            /*eslint-enable camelcase*/
            const { wrapper } = setup({method}, ContactMethod);
            expect(wrapper.find('li').length).toEqual(1);
            // we render slack as a span right now since we haven't setup deep linking
            expect(wrapper.find('span').length).toEqual(2);
            expect(wrapper.find('span').nodes[1].props.children).toEqual(method.value);
        });

        it('renders slack contact method', () => {
            /*eslint-disable camelcase*/
            // null simulates ContactMethodTypeV1.CELL_PHONE
            const method = ProfileFactory.getProfileContactMethod({contact_method_type: null});
            /*eslint-enable camelcase*/
            const { wrapper } = setup({method}, ContactMethod);
            expect(wrapper.find('li').length).toEqual(1);
            expect(wrapper.find('span').length).toEqual(2);
            expect(wrapper.find('span').nodes[1].props.children).toEqual(method.value);
        });

        it('renders email contact method', () => {
            /*eslint-disable camelcase*/
            const method = ProfileFactory.getProfileContactMethod({contact_method_type: ContactMethodTypeV1.EMAIL});
            /*eslint-enable camelcase*/
            const { wrapper } = setup({method}, ContactMethod);
            expect(wrapper.find('li').length).toEqual(1);
            expect(wrapper.find('a').length).toEqual(1);
            expect(wrapper.find('a').nodes[0].props.children).toEqual(method.value);
        });
    });

    describe('Items', () => {
        it('doesn\'t render profile items if the profile doesn\'t contain any', () => {
            const { wrapper } = setup();
            expect(wrapper.find(Items).length).toNotExist();
        });

        it('renders the profile items if the profile contains items', () => {
            const { wrapper, props: { profile } } = setup({profile: ProfileFactory.getProfileWithItems(2)});
            expect(wrapper.find(Items).length).toEqual(1);
            expect(wrapper.find(Items).prop('items')).toEqual(profile.items);
        });

        it('renders the profile items in a list', () => {
            const profile = ProfileFactory.getProfileWithItems(2);
            const { wrapper } = setup({items: profile.items}, Items);
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Info');
            expect(wrapper.find('li').length).toEqual(2);
        });
    });

    describe('Teams', () => {
        it('doesn\'t render if there are no teams', () => {
            const { wrapper } = setup();
            expect(wrapper.find(Teams).length).toNotExist();
        });

        it('renders the teams if the profile is a member of teams', () => {
            const memberships = TeamFactory.getMembers(3);
            const { wrapper } = setup({ memberships });
            expect(wrapper.find(Teams).length).toEqual(1);
            expect(wrapper.find(Teams).prop('members')).toEqual(memberships);
        });

        it('renders DetailListTeamMemberships', () => {
            const members = TeamFactory.getMembers(3);
            const { wrapper } = setup({members}, Teams);
            expect(wrapper.find(DetailSection).prop('title')).toEqual('Teams');
            expect(wrapper.find(DetailListTeamMemberships).length).toEqual(1);
            expect(wrapper.find(DetailListTeamMemberships).prop('members')).toEqual(members);
        });

    });

});
