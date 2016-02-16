import React, { PropTypes } from 'react';

const styles = {
    root: {
        backgroundColor: 'rgb(67, 69, 76)',
        height: 164,
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
