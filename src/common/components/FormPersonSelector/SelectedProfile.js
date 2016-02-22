import React, { PropTypes } from 'react';

import Colors from '../../styles/Colors';

import DownChevronIcon from '../DownChevronIcon';
import UpChevronIcon from '../UpChevronIcon';

const SelectedProfile = ({expanded, onHoverChange, onTouchTap, profile}) => {
    const styles = {
        root: {
            boxSizing: 'border-box',
            color: Colors.black,
            cursor: 'pointer',
            display: 'flex',
            fontSize: '1.4rem',
            height: 38,
            lineHeight: '1.4rem',
            padding: '12px 11px 10px 11px',
            position: 'relative',
            width: '100%',
        },
        name: {
            float: 'left',
        },
        icon: {
            position: 'absolute',
            right: 6,
            top: 10,
        },
    };

    const handleMouseEnter = () => {
        onHoverChange(true);
    }

    const handleMouseLeave = () => {
        onHoverChange(false);
    };

    let selectedName;
    if (profile) {
        const title = profile.title ? `(${ profile.title })` : null;
        selectedName = [profile.full_name, title].filter(s => s).join(' ');
    }

    let icon;
    if (expanded) {
        icon = <UpChevronIcon height={20} width={20} />;
    } else {
        icon = <DownChevronIcon height={20} width={20} />;
    }

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchTap={onTouchTap}
            style={styles.root}
        >
            <div style={styles.name}>
                {selectedName}
            </div>
            <div style={styles.icon}>
                {icon}
            </div>
        </div>
    );
};

SelectedProfile.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onHoverChange: PropTypes.func,
    onTouchTap: PropTypes.func,
    profile: PropTypes.object,
};

export default SelectedProfile;
