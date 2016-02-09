import React from 'react';

import * as routes from '../../utils/routes';
import t from '../../utils/gettext';

import GroupIcon from '../GroupIcon';
import IconContainer from '../IconContainer';
import LightBulbIcon from '../LightBulbIcon';
import OfficeIcon from '../OfficeIcon';
import ProfileAvatar from '../ProfileAvatar';

export function getResult(result, index) {
    let func;
    if (result.profile) {
        func = getProfileResult;
    } else if (result.post) {
        func = getPostResult;
    } else if (result.team) {
        func = getTeamResult;
    } else if (result.location) {
        func = getLocationResult;
    }
    if (func) {
        return func(result, index);
    }
}

export function getProfileResult(result, index) {
    const { profile, highlight } = result;
    let primaryText = profile.full_name;
    let secondaryText = profile.display_title;
    if (highlight && highlight.get('full_name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />;
    }
    if (highlight && highlight.get('display_title')) {
        secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('display_title')}} />;
    }
    return {
        index,
        primaryText,
        secondaryText,
        leftAvatar: <ProfileAvatar profile={profile} />,
        onTouchTap: routes.routeToProfile.bind(null, profile),
        instance: profile,
    };
}

export function getPostResult(result, index) {
    const { post, highlight } = result;
    let primaryText = post.title;
    // posts always return content in the highlight, even if nothing is
    // highlighted
    const secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('content')}} />;
    if (highlight.get('title')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('title')}} />;
    }
    return {
        index,
        primaryText,
        secondaryText,
        leftAvatar: <IconContainer IconClass={LightBulbIcon} stroke="#7c7b7b" />,
        onTouchTap: routes.routeToPost.bind(null, post),
        instance: post,
    };
}

export function getTeamResult(result, index) {
    const { team, highlight } = result;
    let primaryText = team.display_name;
    const secondaryText = t(`${team.profile_count} People`);
    if (highlight && highlight.get('display_name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />;
    }
    return {
        index,
        primaryText,
        secondaryText,
        leftAvatar: <IconContainer IconClass={GroupIcon} />,
        onTouchTap: routes.routeToTeam.bind(null, team),
        instance: team,
    };
}

export function getLocationResult(result, index) {
    const { location, highlight } = result;
    let primaryText = location.name;
    let secondaryText = location.full_address;
    if (highlight && highlight.get('name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />;
    }
    if (highlight && highlight.get('full_address')) {
        secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('full_address')}} />;
    }
    return {
        index,
        primaryText,
        secondaryText,
        leftAvatar: <IconContainer IconClass={OfficeIcon} />,
        onTouchTap: routes.routeToLocation.bind(null, location),
        instance: location,
    }
}
