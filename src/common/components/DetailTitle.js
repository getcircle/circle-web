import React, { PropTypes } from 'react';

const DetailTitle = ({ IconComponent, children, title, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
    return (
        <section className="row start-xs middle-xs" {...other}>
            <IconComponent />
            <h1 style={theme.h1}>{title}</h1>
            {children}
        </section>
    );
};

DetailTitle.propTypes = {
    IconComponent: PropTypes.func,
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
};

DetailTitle.contextTypes ={
    muiTheme: PropTypes.object.isRequired,
};

export default DetailTitle;
