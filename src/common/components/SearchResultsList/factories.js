import keymirror from 'keymirror';
import React from 'react';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import GroupIcon from '../GroupIcon';
import IconContainer from '../IconContainer';
import LightBulbIcon from '../LightBulbIcon';
import ProfileAvatar from '../ProfileAvatar';

export const TYPES = keymirror({
    PROFILE: null,
    POST: null,
    TEAM: null,
});

export function createResult(result, theme) {
    let func;
    if (result.profile) {
        func = createProfileResult;
    } else if (result.post) {
        func = createPostResult;
    } else if (result.team) {
        func = createTeamResult;
    } else if (result.location) {
        func = createLocationResult;
    }
    if (func) {
        return func(result, theme);
    }
}

export function createProfileResult(result, theme) {
    const { profile, highlight } = result;
    const leftAvatar = <ProfileAvatar profile={profile} style={theme.avatar} />;
    let primaryText, secondaryText;
    if (highlight && highlight.get('full_name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} style={theme.primaryText} />;
    } else {
        primaryText = <span style={theme.primaryText}>{profile.full_name}</span>;
    }

    if (highlight && highlight.get('display_title')) {
        secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('display_title')}} />;
    } else {
        secondaryText = <span style={theme.secondaryText}>{profile.display_title}</span>;
    }

    return {
        item: {
            primaryText,
            secondaryText,
            leftAvatar,
            innerDivStyle: theme.innerDivStyle,
        },
        type: TYPES.PROFILE,
        payload: profile,
    }
}

export function createPostResult(result, theme) {
    const { post, highlight } = result;

    let text;
    // posts always return content in the highlight, even if nothing is
    // highlighted
    const secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('content')}} style={theme.secondaryText} />;
    if (highlight.get('title')) {
        text = <div dangerouslySetInnerHTML={{__html: highlight.get('title')}} style={theme.primaryText} />;
    } else {
        text = <span style={theme.primaryText}>{post.title}</span>;
    }

    const primaryText = (
        <div>
            <LightBulbIcon
                height={35}
                style={{position: 'absolute', left: 10, top: 16}}
                stroke={Colors.black}
                width={35}
            />
            {text}
        </div>
    );

    return {
        item: {
            primaryText,
            secondaryText,
            innerDivStyle: theme.innerDivStyle,
        },
        type: TYPES.POST,
        payload: post,
    }
}

export function createTeamResult(result) {
    const { team, highlight } = result;
    const leftAvatar = <IconContainer IconClass={GroupIcon} />;
    let primaryText = team.display_name;
    const secondaryText = t(`${team.profile_count} People`);
    if (highlight && highlight.get('display_name')) {
        primaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('display_name')}} />;
    }
    return {
        item: {
            primaryText,
            secondaryText,
            leftAvatar,
        },
        type: TYPES.TEAM,
        payload: team,
    }
}
