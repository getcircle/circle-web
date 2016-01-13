import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import { QuickSearch } from '../../../src/common/components/QuickSearch';
import createStore from '../../../src/common/createStore';
import SearchAndExplore from '../../../src/common/components/SearchAndExplore';

import OrganizationFactory from '../../factories/OrganizationFactory';
import componentWithContext from '../../componentWithContext';

const store = createStore();

function setup(overrides) {
    const defaults = {
        store: store,
        organization: OrganizationFactory.getOrganization(),
    };
    const props = Object.assign({}, defaults, overrides);
    const Container = componentWithContext(<SearchAndExplore {...props} />);
    const container = TestUtils.renderIntoDocument(<Container />);
    const output = TestUtils.findRenderedComponentWithType(container, SearchAndExplore);
    return {props, output};
}

describe('SearchAndExplore', () => {
    describe('defaults', () => {

        describe('Explore', () => {

            it('is the last section passed', () => {
                const { output } = setup();
                const search = TestUtils.findRenderedComponentWithType(output, QuickSearch);
                const explore = search.props.defaults.slice(-1)[0];
                expect(explore.title).toEqual('Explore');
            });

            it('items represent organization values', () => {
                const { output, props: { organization } } = setup();
                const search = TestUtils.findRenderedComponentWithType(output, QuickSearch);
                const explore = search.props.defaults.slice(-1)[0];
                for (let item of explore.getItems()) {
                    const title = item.primaryText.props.children;
                    if (title.startsWith('Knowledge')) {
                        expect(item.index).toEqual(0);
                        expect(title.endsWith(`(${organization.post_count})`)).toExist();
                    } else if (title.startsWith('People')) {
                        expect(item.index).toEqual(1);
                        expect(title.endsWith(`(${organization.profile_count})`)).toExist();
                    } else if (title.startsWith('Teams')) {
                        expect(item.index).toEqual(2);
                        expect(title.endsWith(`(${organization.team_count})`)).toExist();
                    } else if (title.startsWith('Locations')) {
                        expect(item.index).toEqual(3);
                        expect(title.endsWith(`(${organization.location_count})`)).toExist();
                    }
                };
            });
        });

    });
});
