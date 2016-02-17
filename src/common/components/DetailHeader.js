import React, { PropTypes } from 'react';

import IconContainer from './IconContainer';

const DetailHeader = ({children, Icon, style, ...other}, { muiTheme }) => {
    const styles = {
        container: {
            flexWrap: 'nowrap',
            paddingTop: 35,
            paddingLeft: 35,
        },
        details: {
            paddingLeft: 22,
        },
        root: {
            backgroundColor: 'rgb(67, 69, 76)',
            height: 164,
            position: 'relative',
            zIndex: 1,
        }
    };
    const theme = muiTheme.luno.header;
    return (
        <header {...other} style={{...styles.root, ...style}}>
            <section className="wrap">
                <div className="row start-xs" style={styles.container}>
                    <div>
                        <div className="row">
                            <IconContainer
                                IconClass={Icon}
                                iconStyle={{...theme.icon}}
                                stroke={theme.icon.color}
                                strokeWidth={theme.icon.strokeWidth}
                                style={theme.iconContainer}
                            />
                        </div>
                    </div>
                    <div style={styles.details}>
                        {children}
                    </div>
                </div>
            </section>
        </header>
    );
};

DetailHeader.propTypes = {
    IconComponent: PropTypes.node,
    children: PropTypes.node,
    style: PropTypes.object,
};

DetailHeader.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailHeader;
