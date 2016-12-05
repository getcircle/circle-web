import React, { PropTypes } from 'react';

const DetailContent = ({ children, style }) => {
    const styles = {
        root: {
            padding: '30px 100px',
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
