import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import CSSComponent from './CSSComponent';
import QuickSearch from './QuickSearch';
import Section from './QuickSearch/Section';
import * as itemFactory from './QuickSearch/factories';

/* TODO
 * - want to fetch recents
 * - should autofocus the search input
 * - should display shortcuts if there are no results ("defaults")
 */

function getShortcuts(organization, history) {
    return [
        itemFactory.getShortcut(
            t(`Knowledge (${organization.post_count})`),
            () => {},
            0,
            history,
        ),
        itemFactory.getShortcut(
            t(`People (${organization.profile_count})`),
            () => {},
            1,
            history,
        ),
        itemFactory.getShortcut(
            t(`Teams (${organization.team_count})`),
            () => {},
            2,
            history,
        ),
        itemFactory.getShortcut(
            t(`Locations (${organization.location_count})`),
            () => {},
            3,
            history,
        ),
    ];
}

class SearchAndExplore extends CSSComponent {

    static propTypes = {
        organization: PropTypes.shape({
            /*eslint-disable camelcase*/
            location_count: PropTypes.number,
            post_count: PropTypes.number,
            profile_count: PropTypes.number,
            team_count: PropTypes.number,
            /*eslint-enable camelcase*/
        }).isRequired,
    }

    static contextTypes = {
        history: PropTypes.shape({
            pushState: PropTypes.func.isRequired,
        }),
    }

    getSections() {
        const shortcuts = getShortcuts(this.props.organization, this.context.history);
        return [
            new Section(shortcuts, t('Explore')),
        ];
    }

    render() {
        const sections = this.getSections();
        return <QuickSearch defaults={sections} {...this.props} />;
    }

}

export default SearchAndExplore;
