import expect from 'expect';

import * as itemFactory from '../../../../src/common/components/SearchResults/factories';

import SearchResultFactory from '../../../factories/SearchResultFactory';

function getInnerHTML(element) {
    expect(element.props).toExist('element should have "props"');
    expect(element.props.dangerouslySetInnerHTML).toExist('element props should have "dangerouslySetInnerHTML"');
    return element.props.dangerouslySetInnerHTML.__html;
}

describe('SearchResults factories', () => {

    describe('getProfileResult', () => {

        it('handles profiles with no highlights', () => {
            const result = SearchResultFactory.getSearchResultWithProfile();
            const item = itemFactory.getProfileResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.profile);
            expect(item.primaryText).toEqual(result.profile.full_name);
            expect(item.secondaryText).toEqual(result.profile.display_title);
        });

        it('handles profiles with a highlighted name', () => {
            const result = SearchResultFactory.getSearchResultWithProfile(true);
            const item = itemFactory.getProfileResult(result);
            const primaryText = getInnerHTML(item.primaryText);
            expect(item.primaryText.type).toEqual('div');
            expect(primaryText).toEqual(result.highlight.get('full_name'));
        });

        it('handles profiles with a highlighted title', () => {
            const result = SearchResultFactory.getSearchResultWithProfile(false, true);
            const item = itemFactory.getProfileResult(result);
            const secondaryText = getInnerHTML(item.secondaryText);
            expect(item.secondaryText.type).toEqual('div');
            expect(secondaryText).toEqual(result.highlight.get('display_title'));
        });

        it('handles profiles with both name and title highlighted', () => {
            const result = SearchResultFactory.getSearchResultWithProfile(true, true);
            const item = itemFactory.getProfileResult(result);
            const primaryText = getInnerHTML(item.primaryText);
            const secondaryText = getInnerHTML(item.secondaryText);
            expect(primaryText).toEqual(result.highlight.get('full_name'));
            expect(secondaryText).toEqual(result.highlight.get('display_title'));
        });

    });

    describe('getPostResult', () => {

        it('handles posts with no highlights', () => {
            const result = SearchResultFactory.getSearchResultWithPost();
            const item = itemFactory.getPostResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.post);
            expect(item.primaryText).toEqual(result.post.title);
            const secondaryText = getInnerHTML(item.secondaryText);
            expect(secondaryText).toEqual(result.highlight.get('content'));
            expect(secondaryText).toNotContain('<mark>');
        });

        it('handles posts with a highlighted title', () => {
            const result = SearchResultFactory.getSearchResultWithPost(true);
            const item = itemFactory.getPostResult(result);
            const primaryText = getInnerHTML(item.primaryText);
            expect(primaryText).toEqual(result.highlight.get('title'));
        });

    });

    // TODO these should handle new teams
    //describe('getTeamResult', () => {

        //it('handles teams with no highlights', () => {
            //const result = SearchResultFactory.getSearchResultWithTeam();
            //const item = itemFactory.getTeamResult(result, 0);
            //expect(item.index).toEqual(0);
            //expect(item.instance).toBe(result.team);
            //expect(item.primaryText).toEqual(result.team.display_name);
            //expect(item.secondaryText).toEqual(`${result.team.profile_count} People`);
        //});

        //it('handles teams with a highlighted name', () => {
            //const result = SearchResultFactory.getSearchResultWithTeam(true);
            //const item = itemFactory.getTeamResult(result);
            //const primaryText = getInnerHTML(item.primaryText);
            //expect(primaryText).toEqual(result.highlight.get('display_name'));
        //});

    //});

    describe('getLocationResult', () => {

        it('handles locations with no highlights', () => {
            const result = SearchResultFactory.getSearchResultWithLocation();
            const item = itemFactory.getLocationResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.location);
            expect(item.primaryText).toEqual(result.location.name);
            expect(item.secondaryText).toEqual(result.location.full_address);
        });

        it('handles locations with a higlighted name', () => {
            const result = SearchResultFactory.getSearchResultWithLocation(true);
            const item = itemFactory.getLocationResult(result);
            const primaryText = getInnerHTML(item.primaryText);
            expect(primaryText).toEqual(result.highlight.get('name'));
        });

        it('handles locations with a highlighted address', () => {
            const result = SearchResultFactory.getSearchResultWithLocation(false, true);
            const item = itemFactory.getLocationResult(result);
            const secondaryText = getInnerHTML(item.secondaryText);
            expect(secondaryText).toEqual(result.highlight.get('full_address'));
        });

    });

    describe('getResult', () => {

        it('correctly returns a profile result', () => {
            const result = SearchResultFactory.getSearchResultWithProfile();
            const item = itemFactory.getResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.profile);
            expect(item.primaryText).toEqual(result.profile.full_name);
            expect(item.secondaryText).toEqual(result.profile.display_title);
        });

        it('correctly returns a post result', () => {
            const result = SearchResultFactory.getSearchResultWithPost();
            const item = itemFactory.getResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.post);
            expect(item.primaryText).toEqual(result.post.title);
            const secondaryText = getInnerHTML(item.secondaryText);
            expect(secondaryText).toEqual(result.highlight.get('content'));
            expect(secondaryText).toNotContain('<mark>');
        });

        it('correctly returns a location result', () => {
            const result = SearchResultFactory.getSearchResultWithLocation();
            const item = itemFactory.getResult(result, 0);
            expect(item.index).toEqual(0);
            expect(item.instance).toBe(result.location);
            expect(item.primaryText).toEqual(result.location.name);
            expect(item.secondaryText).toEqual(result.location.full_address);
        });

        it('returns null if it can\'t understand the result', () => {
            const item = itemFactory.getResult({}, 0);
            expect(item).toBe(undefined);
        });

    });

});
