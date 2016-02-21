import React, { PropTypes } from 'react';

const DetailContent = ({ children, style }) => {
    const styles = {
        root: {
            padding: '0 100px 0 100px',
            paddingTop: 50,
        },
    };

    return (
        <section className="wrap" style={{...styles.root, ...style}}>
            {children}
        </section>
    );
};

DetailContent.propTypes = {
    children: PropTypes.node,
};

export default DetailContent;
