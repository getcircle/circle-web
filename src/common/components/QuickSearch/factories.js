import React from 'react';

import { RESULT_TYPES } from './index'
import * as routes from '../../utils/routes';
import t from '../../utils/gettext';

import ProfileAvatar from '../ProfileAvatar';
import GroupIcon from '../GroupIcon';
import OfficeIcon from '../OfficeIcon';
import LightBulbIcon from '../LightBulbIcon';
import IconContainer from '../IconContainer';
import SearchIcon from '../SearchIcon';

export function getSearchTrigger(inputValue, index, history, styles) {
    return {
        index: index,
        leftAvatar: <IconContainer IconClass={SearchIcon} {...styles.IconContainer} />,
        primaryText: (<span>{t('Search')}&nbsp;&ldquo;<mark>{inputValue}</mark>&rdquo;</span>),
        onTouchTap: routes.routeToSearch.bind(null, history, inputValue),
    }
}

export function getProfileResult(profile, index, highlight, history, styles) {
    let primaryText = profile.full_name;
    if (highlight && highlight.get('full_name')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <ProfileAvatar profile={profile} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToProfile.bind(null, history, profile),
        type: RESULT_TYPES.PROFILE,
        instance: profile,
    };
    return item;
}

export function getTeamResult(team, index, highlight, history, styles) {
    let primaryText = team.display_name;
    if (highlight && highlight.get('display_name')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={GroupIcon} {...styles.IconContainer} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToTeam.bind(null, history, team),
        type: RESULT_TYPES.TEAM,
        instance: team,
    };
    return item;
}

export function getLocationResult(location, index, highlight, history, styles) {
    let primaryText = location.name;
    if (highlight && highlight.get('name')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={OfficeIcon} {...styles.IconContainer} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToLocation.bind(null, history, location),
        type: RESULT_TYPES.LOCATION,
        instance: location,
    };
    return item;
}

export function getPostResult(post, index, highlight, history, styles) {
    let primaryText = post.title;
    if (highlight && highlight.get('title')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('title')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={LightBulbIcon} {...styles.IconContainer} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToPost.bind(null, history, post),
        type: RESULT_TYPES.POST,
        instance: post,
    };
    return item;
}
