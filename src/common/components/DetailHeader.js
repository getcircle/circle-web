import React, { PropTypes } from 'react';

const styles = {
    root: {
        backgroundColor: 'rgb(51, 51, 51)',
        height: 290,
        position: 'relative',
        zIndex: 1,
    }
};

const DetailHeader = ({style, ...other}) => {
    return <header {...other} style={{...styles.root, ...style}} />;
};
DetailHeader.propTypes = {
    style: PropTypes.object,
}

export default DetailHeader;
