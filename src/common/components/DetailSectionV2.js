import React, { PropTypes } from 'react';

import DetailDivider from './DetailDivider';

const DetailSection = (props, { muiTheme }) => {
    const { children, dividerStyle, style, title, ...other} = props;
    const styles = {
        root: {
            paddingTop: 35,
        },
    };
    const theme = muiTheme.luno.detail;
    return (
        <section style={{...styles.root, ...style}} {...other}>
            <h2 style={theme.h2}>{title}</h2>
            <DetailDivider style={dividerStyle} />
            {children}
        </section>
    );
};

DetailSection.propTypes = {
    children: PropTypes.node,
    dividerStyle: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
};

DetailSection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailSection;
