import keymirror from 'keymirror';
import React from 'react';

import Colors from '../../styles/Colors';
import t from '../../utils/gettext';

import GroupIcon from '../GroupIcon';
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
    let secondaryText;
    const primaryText = <span style={theme.primaryText}>{profile.full_name}</span>;

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

export function createPostResult({ post, highlight }, theme) {

    let secondaryText;
    const text = <span style={theme.primaryText}>{post.title}</span>;

    // posts always return content in the highlight, even if nothing is
    // highlighted
    if (highlight.get('content')) {
        secondaryText = <div dangerouslySetInnerHTML={{__html: highlight.get('content')}} style={theme.secondaryText} />;
    } else {
        secondaryText = <span style={theme.secondaryText}>{post.snippet}</span>;
    }

    const primaryText = (
        <div>
            <LightBulbIcon
                height={35}
                stroke={Colors.black}
                style={{position: 'absolute', left: 10, top: 10}}
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
            secondaryTextLines: 2,
        },
        type: TYPES.POST,
        payload: post,
    }
}

export function createTeamResult({ team, highlight }, theme) {

    let description, members;
    const name = <span style={theme.primaryText}>{team.name}</span>;

    if (highlight && highlight.get('description')) {
        description = <div dangerouslySetInnerHTML={{__html: highlight.get('description')}} style={theme.secondaryText} />;
    } else if (team.description) {
        description = <span style={theme.secondaryText}>{team.description.value}</span>;
    }

    if (team.total_members && team.total_members > 1) {
        members = t(`${team.total_members} Members`);
    } else {
        members = t(`${team.total_members} Member`);
    }

    const primaryText = (
        <div>
            <GroupIcon
                height={35}
                stroke={Colors.black}
                style={{position: 'absolute', left: 10, top: 10}}
                width={35}
            />
            {name}
        </div>
    );

    const secondaryText = (
        <div style={{overflow: 'visible'}}>
            <span style={{...theme.secondaryText, ...{color: Colors.extraLightBlack}}}>{members}</span>
            <br />
            {description}
        </div>
    );

    return {
        item: {
            primaryText,
            secondaryText,
            innerDivStyle: theme.innerDivStyle,
            secondaryTextLines: 2,
        },
        type: TYPES.TEAM,
        payload: team,
    }
}
