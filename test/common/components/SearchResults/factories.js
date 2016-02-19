import expect from 'expect';
import { ListItem } from 'material-ui';

import * as itemFactory from '../../../../src/common/components/SearchResults/factories';

import SearchResultFactory from '../../../factories/SearchResultFactory';

const setup = buildSetup(ListItem);

describe('SearchResults factories', () => {

    describe('createProfileResult', () => {

        it('handles profiles with no highlights', () => {
            const result = SearchResultFactory.getSearchResultWithProfile();
            const searchResult = itemFactory.createProfileResult(result);
            expect(searchResult.type).toEqual(itemFactory.TYPES.PROFILE);
            expect(searchResult.payload).toEqual(result.profile);

            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.profile.full_name)).toExist();
            expect(html.includes(result.profile.display_title)).toExist();
        });

        it('handles profiles with a highlighted name', () => {
            const result = SearchResultFactory.getSearchResultWithProfile(true);
            const searchResult = itemFactory.createProfileResult(result);
            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.highlight.get('full_name'))).toExist();
        });

        it('handles profiles with a highlighted title', () => {
            const result = SearchResultFactory.getSearchResultWithProfile(false, true);
            const searchResult = itemFactory.createProfileResult(result);
            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.highlight.get('display_title'))).toExist();
        });

    });

    describe('createPostResult', () => {

        it('handles posts with no highlights', () => {
            const result = SearchResultFactory.getSearchResultWithPost();
            const searchResult = itemFactory.createPostResult(result);
            expect(searchResult.type).toEqual(itemFactory.TYPES.POST);
            expect(searchResult.payload).toEqual(result.post);

            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.post.title)).toExist();
            expect(html.includes(result.post.snippet)).toExist();
        });

        it('handles posts with a highlighted title', () => {
            const result = SearchResultFactory.getSearchResultWithPost(true);
            const searchResult = itemFactory.createPostResult(result);
            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.highlight.get('title'))).toExist();
        });

        it('handles posts with a highlighted content', () => {
            const result = SearchResultFactory.getSearchResultWithPost(false, true);
            const searchResult = itemFactory.createPostResult(result);
            const { wrapper } = setup(searchResult.item);
            const html = wrapper.html();
            expect(html.includes(result.highlight.get('content'))).toExist();
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

    //describe('getLocationResult', () => {

        //it('handles locations with no highlights', () => {
            //const result = SearchResultFactory.getSearchResultWithLocation();
            //const item = itemFactory.getLocationResult(result, 0);
            //expect(item.index).toEqual(0);
            //expect(item.instance).toBe(result.location);
            //expect(item.primaryText).toEqual(result.location.name);
            //expect(item.secondaryText).toEqual(result.location.full_address);
        //});

        //it('handles locations with a higlighted name', () => {
            //const result = SearchResultFactory.getSearchResultWithLocation(true);
            //const item = itemFactory.getLocationResult(result);
            //const primaryText = getInnerHTML(item.primaryText);
            //expect(primaryText).toEqual(result.highlight.get('name'));
        //});

        //it('handles locations with a highlighted address', () => {
            //const result = SearchResultFactory.getSearchResultWithLocation(false, true);
            //const item = itemFactory.getLocationResult(result);
            //const secondaryText = getInnerHTML(item.secondaryText);
            //expect(secondaryText).toEqual(result.highlight.get('full_address'));
        //});

    //});

    //describe('getResult', () => {

        //it('correctly returns a profile result', () => {
            //const result = SearchResultFactory.getSearchResultWithProfile();
            //const item = itemFactory.getResult(result, 0);
            //expect(item.index).toEqual(0);
            //expect(item.instance).toBe(result.profile);
            //expect(item.primaryText).toEqual(result.profile.full_name);
            //expect(item.secondaryText).toEqual(result.profile.display_title);
        //});

        //it('correctly returns a post result', () => {
            //const result = SearchResultFactory.getSearchResultWithPost();
            //const item = itemFactory.getResult(result, 0);
            //expect(item.index).toEqual(0);
            //expect(item.instance).toBe(result.post);
            //expect(item.primaryText).toEqual(result.post.title);
            //const secondaryText = getInnerHTML(item.secondaryText);
            //expect(secondaryText).toEqual(result.highlight.get('content'));
            //expect(secondaryText).toNotContain('<mark>');
        //});

        //it('correctly returns a location result', () => {
            //const result = SearchResultFactory.getSearchResultWithLocation();
            //const item = itemFactory.getResult(result, 0);
            //expect(item.index).toEqual(0);
            //expect(item.instance).toBe(result.location);
            //expect(item.primaryText).toEqual(result.location.name);
            //expect(item.secondaryText).toEqual(result.location.full_address);
        //});

        //it('returns null if it can\'t understand the result', () => {
            //const item = itemFactory.getResult({}, 0);
            //expect(item).toBe(undefined);
        //});

    //});

});
