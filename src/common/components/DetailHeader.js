import React, { PropTypes } from 'react';

import IconContainer from './IconContainer';

const DetailHeader = ({avatar, children, primaryText, secondaryText, Icon, ...other}, { muiTheme }) => {
    const styles = {
        container: {
            flexWrap: 'nowrap',
            paddingTop: 35,
            paddingLeft: 35,
        },
        details: {
            paddingLeft: 22,
        },
        detailsSection: {
            paddingTop: 20,
        },
        root: {
            backgroundColor: 'rgb(67, 69, 76)',
            height: 164,
            position: 'relative',
            zIndex: 1,
        },
        secondaryHeader: {
            paddingTop: 10,
        },
    };
    const theme = muiTheme.luno.header;

    let icon;
    if (avatar) {
        icon = avatar;
    } else if (Icon) {
        icon = (
            <IconContainer
                IconClass={Icon}
                iconStyle={{...theme.icon}}
                stroke={theme.icon.color}
                strokeWidth={theme.icon.strokeWidth}
                style={theme.iconContainer}
            />
        );
    };

    return (
        <header {...other} style={styles.root}>
            <section className="wrap">
                <div className="row start-xs" style={styles.container}>
                    <div>
                        <div className="row">
                            {icon}
                        </div>
                    </div>
                    <div style={styles.details}>
                        <section style={styles.detailsSection}>
                            <div className="row start-xs">
                                <span style={theme.primaryText}>{primaryText}</span>
                            </div>
                            <div className="row start-xs" style={styles.secondaryHeader}>
                                <span style={theme.secondaryText}>{secondaryText}</span>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </header>
    );
};

DetailHeader.propTypes = {
    IconComponent: PropTypes.func,
    avatar: PropTypes.node,
    children: PropTypes.node,
    primaryText: PropTypes.node,
    secondaryText: PropTypes.node,
    style: PropTypes.object,
};

DetailHeader.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailHeader;
