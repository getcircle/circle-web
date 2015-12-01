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
        mixins: {},
    };
    const context = Object.assign({}, defaultContext, contextOverrides);

    class SearchTestContainer extends CSSComponent {

        static childContextTypes = {
            authenticatedProfile: PropTypes.instanceOf(services.profile.containers.ProfileV1),
            history: PropTypes.shape({
                pushState: PropTypes.func.isRequired,
            }).isRequired,
            mixins: PropTypes.object.isRequired,
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
        const profile = searchResultWithProfile.profile;
        const { searchComponent } = setup({results: [searchResultWithProfile]});

        expect(searchComponent.getProfileTexts(profile)).toExist();
        expect(searchComponent.getProfileTexts(profile).primaryText).toBe(profile.full_name);
        expect(searchComponent.getProfileTexts(profile).secondaryText).toBe(profile.display_title);
    });

    it('shows highlighted full name when matched for profiles', () => {
        let profileSearchResultWithHighlightedName = SearchResultFactory.getSearchResultWithProfile(true);
        const {
            highlight,
            profile,
        } = profileSearchResultWithHighlightedName;
        const { searchComponent } = setup({results: [profileSearchResultWithHighlightedName]});

        expect(searchComponent.getProfileTexts(profile, highlight)).toExist();
        expect(searchComponent.getProfileTexts(profile, highlight).primaryText).toEqual((<div
            dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />
        ));
        expect(searchComponent.getProfileTexts(profile, highlight).secondaryText).toBe(profile.display_title);
    });

    it('shows highlighted title when matched for profiles', () => {
        let profileSearchResultWithHighlightedTitle = SearchResultFactory.getSearchResultWithProfile(false, true);
        const {
            highlight,
            profile,
        } = profileSearchResultWithHighlightedTitle;
        const { searchComponent } = setup({results: [profileSearchResultWithHighlightedTitle]});

        expect(searchComponent.getProfileTexts(profile, highlight)).toExist();
        expect(searchComponent.getProfileTexts(profile, highlight).primaryText).toBe(profile.full_name);
        expect(searchComponent.getProfileTexts(profile, highlight).secondaryText).toEqual((<span
            dangerouslySetInnerHTML={{__html: highlight.get('display_title')}} />
        ));
    });

    it('does not show highlighted term if its not available for teams', () => {
        let teamSearchResult = SearchResultFactory.getSearchResultWithTeam();
        const team = teamSearchResult.team;
        const { searchComponent } = setup({results: [teamSearchResult]});

        expect(searchComponent.getTeamPrimaryText(team)).toBe(team.display_name);
    });

    it('shows highlighted team name when matched for teams', () => {
        let teamSearchResultWithHighlightedName = SearchResultFactory.getSearchResultWithTeam(true);
        const {
            highlight,
            team,
        } = teamSearchResultWithHighlightedName;
        const { searchComponent } = setup({results: [teamSearchResultWithHighlightedName]});

        expect(searchComponent.getTeamPrimaryText(team, highlight)).toEqual((<div
            dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />
        ));
    });

    it('does not show highlighted term if its not available for locations', () => {
        let searchResultWithLocation = SearchResultFactory.getSearchResultWithLocation();
        const location = searchResultWithLocation.location;
        const locationSecondaryText = `${location.city}, ${location.region} (${location.profile_count})`;
        const { searchComponent } = setup({results: [
            searchResultWithLocation,
        ]});

        expect(searchComponent.getLocationTexts(location)).toExist();
        expect(searchComponent.getLocationTexts(location).primaryText).toBe(location.name);
        expect(searchComponent.getLocationTexts(location).secondaryText).toBe(locationSecondaryText);
    });

    it('shows highlighted location name when matched for locations', () => {
        let locationSearchResultWithHighlightedName = SearchResultFactory.getSearchResultWithLocation(true);
        const {
            location,
            highlight,
        } = locationSearchResultWithHighlightedName;
        const locationSecondaryText = `${location.city}, ${location.region} (${location.profile_count})`;
        const { searchComponent } = setup({results: [locationSearchResultWithHighlightedName]});

        expect(searchComponent.getLocationTexts(location, highlight)).toExist();
        expect(searchComponent.getLocationTexts(location, highlight).primaryText).toEqual((<div
            dangerouslySetInnerHTML={{__html: highlight.get('name')}} />
        ));
        expect(searchComponent.getLocationTexts(location, highlight).secondaryText).toBe(locationSecondaryText);
    });

    it('shows highlighted address when matched for locations', () => {
        let locationSearchResultWithHighlightedAddress = SearchResultFactory.getSearchResultWithLocation(false, true);
        const {
            location,
            highlight,
        } = locationSearchResultWithHighlightedAddress;
        const { searchComponent } = setup({results: [locationSearchResultWithHighlightedAddress]});

        expect(searchComponent.getLocationTexts(location, highlight)).toExist();
        expect(searchComponent.getLocationTexts(location, highlight).primaryText).toBe(location.name);
        expect(searchComponent.getLocationTexts(location, highlight).secondaryText).toEqual((<span
            dangerouslySetInnerHTML={{__html: highlight.get('full_address') + ' (' + location.profile_count + ')'}} />
        ));

    });
});
