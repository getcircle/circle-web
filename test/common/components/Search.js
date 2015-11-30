import faker from 'faker';
import expect from 'expect';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import TestUtils from 'react-addons-test-utils';

import createStore from '../../../src/common/createStore';
import SearchResultFactory from '../../factories/SearchResultFactory';
import ProfileFactory from '../../factories/ProfileFactory';

import CSSComponent from '../../../src/common/components/CSSComponent';
import Search from '../../../src/common/components/Search';

const store = createStore();

function setup(propsOverrides, contextOverrides) {

    // Props
    const defaultProps = {
        canExplore: false,
        focused: true,
        largerDevice: true,
        searchLocation: faker.hacker.verb(),
        store: store,
    }
    const props = Object.assign({}, defaultProps, propsOverrides);

    // Context
    const defaultContext = {
        authenticatedProfile: ProfileFactory.getProfile(),
        history: {
            pushState: expect.createSpy(),
        },
    };
    const context = Object.assign({}, defaultContext, contextOverrides);

    class SearchTestContainer extends CSSComponent {

        static childContextTypes = {
            authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
            history: PropTypes.shape({
                pushState: PropTypes.func.isRequired,
            }).isRequired,
        }

        getChildContext() {
            return context;
        }

        render() {
            return (
                <Search {...props} />
            );
        }
    }

    let container = TestUtils.renderIntoDocument(<SearchTestContainer />);
    const searchComponent = TestUtils.findRenderedComponentWithType(container, Search).getWrappedInstance();
    return {
        searchComponent,
        props,
        container,
    };
}

describe('SearchComponent', () => {

    it('does not show highlighted term if its not available for profiles', () => {
        let searchResultWithProfile = SearchResultFactory.getSearchResultWithProfile();
        const { searchComponent } = setup({results: [
            searchResultWithProfile,
        ]});

        expect(searchComponent.getProfileTexts(searchResultWithProfile.profile)).toExist();
        expect(searchComponent.getProfileTexts(searchResultWithProfile.profile).primaryText)
            .toBe(searchResultWithProfile.profile.full_name);
        expect(searchComponent.getProfileTexts(searchResultWithProfile.profile).secondaryText)
            .toBe(searchResultWithProfile.profile.display_title);
    });

    it('shows highlighted full name when matched for profiles', () => {
        let profileSearchResultWithHighlightedName = SearchResultFactory.getSearchResultWithProfile(true);
        const { searchComponent } = setup({results: [
            profileSearchResultWithHighlightedName,
        ]});

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedName.profile,
            profileSearchResultWithHighlightedName.highlight
        )).toExist();

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedName.profile,
            profileSearchResultWithHighlightedName.highlight
        ).primaryText).toEqual((<div
            dangerouslySetInnerHTML={{__html: profileSearchResultWithHighlightedName.highlight.get('full_name')}} />
        ));

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedName.profile,
            profileSearchResultWithHighlightedName.highlight,
        ).secondaryText).toBe(profileSearchResultWithHighlightedName.profile.display_title);
    });

    it('shows highlighted title when matched for profiles', () => {
        let profileSearchResultWithHighlightedTitle = SearchResultFactory.getSearchResultWithProfile(false, true);
        const { searchComponent } = setup({results: [
            profileSearchResultWithHighlightedTitle,
        ]});

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedTitle.profile,
            profileSearchResultWithHighlightedTitle.highlight
        )).toExist();

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedTitle.profile,
            profileSearchResultWithHighlightedTitle.highlight,
        ).primaryText).toBe(profileSearchResultWithHighlightedTitle.profile.full_name);

        expect(searchComponent.getProfileTexts(
            profileSearchResultWithHighlightedTitle.profile,
            profileSearchResultWithHighlightedTitle.highlight
        ).secondaryText).toEqual((<div
            dangerouslySetInnerHTML={{__html: profileSearchResultWithHighlightedTitle.highlight.get('display_title')}} />
        ));

    });

    it('does not show highlighted term if its not available for teams', () => {
        let teamSearchResult = SearchResultFactory.getSearchResultWithTeam();
        const { searchComponent } = setup({results: [
            teamSearchResult,
        ]});

        expect(searchComponent.getTeamPrimaryText(teamSearchResult.team))
        .toBe(teamSearchResult.team.display_name);
    });

    it('shows highlighted full name when matched for profiles', () => {
        let teamSearchResultWithHighlightedName = SearchResultFactory.getSearchResultWithTeam(true);
        const { searchComponent } = setup({results: [
            teamSearchResultWithHighlightedName,
        ]});

        expect(searchComponent.getTeamPrimaryText(
            teamSearchResultWithHighlightedName.team,
            teamSearchResultWithHighlightedName.highlight
        )).toEqual((<div
            dangerouslySetInnerHTML={{__html: teamSearchResultWithHighlightedName.highlight.get('display_name')}} />
        ));
    });

});
