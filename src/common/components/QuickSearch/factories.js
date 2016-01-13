import keymirror from 'keymirror';
import React from 'react';

import * as routes from '../../utils/routes';
import t from '../../utils/gettext';

import ProfileAvatar from '../ProfileAvatar';
import GroupIcon from '../GroupIcon';
import OfficeIcon from '../OfficeIcon';
import LightBulbIcon from '../LightBulbIcon';
import IconContainer from '../IconContainer';
import SearchIcon from '../SearchIcon';

const ICON_CONTAINER_STYLE = {
    style: {
        height: 40,
        width: 40,
        border: '',
    },
    iconStyle: {
        height: 30,
        width: 30,
    },
    strokeWidth: 1,
    stroke: '#7c7b7b',
};

const RESULT_TYPES = keymirror({
    PROFILE: null,
    TEAM: null,
    LOCATION: null,
    POST: null,
});

export function getSearchTrigger(inputValue, index, history) {
    return {
        index: index,
        leftAvatar: <IconContainer IconClass={SearchIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: (<span>{t('Search')}&nbsp;&ldquo;<mark>{inputValue}</mark>&rdquo;</span>),
        onTouchTap: routes.routeToSearch.bind(null, history, inputValue),
    };
}

export function getShortcut(title, onTouchTap, index, history) {
    return {
        index: index,
        leftAvatar: <IconContainer IconClass={SearchIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: <span>{title}</span>,
        onTouchTap: onTouchTap,
    };
}

export function getProfileResult(profile, index, highlight, history) {
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

export function getTeamResult(team, index, highlight, history) {
    let primaryText = team.display_name;
    if (highlight && highlight.get('display_name')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={GroupIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToTeam.bind(null, history, team),
        type: RESULT_TYPES.TEAM,
        instance: team,
    };
    return item;
}

export function getLocationResult(location, index, highlight, history) {
    let primaryText = location.name;
    if (highlight && highlight.get('name')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={OfficeIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToLocation.bind(null, history, location),
        type: RESULT_TYPES.LOCATION,
        instance: location,
    };
    return item;
}

export function getPostResult(post, index, highlight, history) {
    let primaryText = post.title;
    if (highlight && highlight.get('title')) {
        primaryText = (<div dangerouslySetInnerHTML={{__html: highlight.get('title')}} />);
    }
    const item = {
        index: index,
        leftAvatar: <IconContainer IconClass={LightBulbIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
        onTouchTap: routes.routeToPost.bind(null, history, post),
        type: RESULT_TYPES.POST,
        instance: post,
    };
    return item;
}
