import React, { PropTypes } from 'react';

import IconContainer from './IconContainer';

const DetailHeader = (props, { muiTheme }) => {
    const {
        Icon,
        avatar,
        button,
        children,
        primaryText,
        secondaryText,
        ...other
    } = props;
    const styles = {
        button: {
            alignItems: 'center',
            display: 'flex',
            marginLeft: 'auto',
            paddingLeft: 20,
        },
        container: {
            flexWrap: 'nowrap',
            paddingTop: 35,
            paddingLeft: 35,
        },
        details: {
            paddingLeft: 22,
        },
        detailsSection: {
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
                    <div className="row middle-xs" style={styles.details}>
                        <section style={styles.detailsSection}>
                            <div className="row start-xs">
                                <span style={theme.primaryText}>{primaryText}</span>
                            </div>
                            <div className="row start-xs" style={styles.secondaryHeader}>
                                <span style={theme.secondaryText}>{secondaryText}</span>
                            </div>
                        </section>
                    </div>
                    <div style={styles.button}>
                        <div className="row">
                            {button}
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
};

DetailHeader.propTypes = {
    Icon: PropTypes.func,
    avatar: PropTypes.node,
    button: PropTypes.object,
    children: PropTypes.node,
    primaryText: PropTypes.node,
    secondaryText: PropTypes.node,
    style: PropTypes.object,
};

DetailHeader.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailHeader;
