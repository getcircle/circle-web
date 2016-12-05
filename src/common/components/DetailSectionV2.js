import React, { PropTypes } from 'react';

import DetailDivider from './DetailDivider';

const DetailSection = (props, { muiTheme }) => {
    const { children, dividerStyle, style, title, ...other} = props;
    const theme = muiTheme.luno.detail;
    const header = title ? <h2 style={theme.h2}>{title}</h2> : null;
    return (
        <section className="detail-section" style={style} {...other}>
            {header}
            <DetailDivider style={dividerStyle} />
            {children}
        </section>
    );
};

DetailSection.propTypes = {
    children: PropTypes.node,
    dividerStyle: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string,
};

DetailSection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailSection;
