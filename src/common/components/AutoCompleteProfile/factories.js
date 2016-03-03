import React from 'react';
import Colors from '../../styles/Colors';

export const createProfileWithTitle = ({ profile, highlight }) => {
    const styles = {
        name: {
            fontSize: '1.4rem',
        },
        title: {
            color: Colors.mediumBlack,
            fontSize: '1.1rem',
        },
    };

    let fullName, title;
    if (highlight && highlight.get('full_name')) {
        fullName = <span style={styles.name} dangerouslySetInnerHTML={{__html: highlight.get('full_name')}} />;
    } else {
        fullName = <span style={styles.name}>{profile.full_name}</span>;
    }

    if (highlight && highlight.get('title')) {
        title = <span dangerouslySetInnerHTML={{__html: highlight.get('title')}} />;
    } else {
        title = <span>{profile.title}</span>;
    }

    const primaryText = (
        <div>
            {fullName}<span style={styles.title}>{' ('}{title}{')'}</span>
        </div>
    );
    const item = {
        primaryText: primaryText,
        innerDivStyle: {
            paddingTop: 10,
            paddingLeft: 20,
        },
        style: {
            fontSize: '1.4rem',
        },
    };
    return {
        item,
        type: 'profile',
        payload: profile,
    };
};
