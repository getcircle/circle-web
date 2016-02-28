import keymirror from 'keymirror';
import React from 'react';

import t from '../../utils/gettext';

import CollectionIcon from '../CollectionIcon';
import ProfileAvatar from '../ProfileAvatar';
import GroupIcon from '../GroupIcon';
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

export const TYPES = keymirror({
    TRIGGER: null,
    PROFILE: null,
    TEAM: null,
    POST: null,
});

export function createSearchTrigger(query) {
    const item = {
        leftAvatar: <IconContainer IconClass={SearchIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: <span>{t('Search')}&nbsp;&ldquo;<mark>{query}</mark>&rdquo;</span>,
    };
    return {
        item,
        type: TYPES.TRIGGER,
        payload: query,
    };
};

export function createProfileResult({ profile, highlight }) {
    let primaryText = profile.full_name;
    if (highlight && highlight.get('full_name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />;
    }
    const item = {
        leftAvatar: <ProfileAvatar profile={profile} />,
        primaryText: primaryText,
    };
    return {
        item,
        type: TYPES.PROFILE,
        payload: profile,
    };
};

export function createTeamResult({ team, highlight }) {
    let primaryText = team.display_name;
    if (highlight && highlight.get('name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />;
    }
    const item = {
        leftAvatar: <IconContainer IconClass={GroupIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
    };
    return {
        item,
        type: TYPES.TEAM,
        payload: team,
    };
}

export function createPostResult({ post, highlight }) {
    let primaryText = post.title;
    if (highlight && highlight.get('title')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('title')}} />;
    }
    const item = {
        leftAvatar: <IconContainer IconClass={LightBulbIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
    };
    return {
        item,
        type: TYPES.POST,
        payload: post,
    };
}

export function createCollectionResult({ collection, highlight }) {
    let primaryText = collection.name;
    if (highlight && highlight.get('name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('name')}} />;
    }
    const item = {
        leftAvatar: <IconContainer IconClass={CollectionIcon} {...ICON_CONTAINER_STYLE} />,
        primaryText: primaryText,
    };
    return {
        item,
        type: TYPES.COLLETION,
        payload: collection,
    };
}
