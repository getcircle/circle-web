import React, { PropTypes } from 'react';

import CSSComponent from './CSSComponent';
import QuickSearch from './QuickSearch';
import Section from './QuickSearch/Section';
import * as itemFactory from './QuickSearch/factories';

/* TODO
 * - want to fetch recents
 * - should autofocus the search input
 * - should display shortcuts if there are no results ("defaults")
 */

class SearchAndExplore extends CSSComponent {

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }),
    }

    render() {
        const { history } = this.context;
        const recents = [
            itemFactory.getShortcut('Recent 1', () => {}, 0, history),
            itemFactory.getShortcut('Recent 2', () => {}, 1, history),
            itemFactory.getShortcut('Recent 3', () => {}, 2, history),
        ];
        const shortcuts = [
            itemFactory.getShortcut('Knowledge', () => {}, 0, history),
            itemFactory.getShortcut('People', () => {}, 1, history),
            itemFactory.getShortcut('Teams', () => {}, 2, history),
            itemFactory.getShortcut('Location', () => {}, 3, history),
        ];
        const sections = [
            new Section(recents, 'Recents'),
            new Section(shortcuts, 'Explore'),
        ];
        return <QuickSearch defaults={sections} {...this.props} />;
    }

}

export default SearchAndExplore;
