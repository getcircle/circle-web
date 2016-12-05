import React, { PropTypes } from 'react';

const Canvas = ({ children, style, ...other }, { muiTheme }) => {
    const styles = {
        root: {
            backgroundColor: muiTheme.baseTheme.palette.canvasColor,
            direction: 'ltr',
            height: '100%',
        },
    };
    return (
        <div style={{...styles.root, ...style}}>
            {children}
        </div>
    );
};

Canvas.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
};

Canvas.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Canvas;
