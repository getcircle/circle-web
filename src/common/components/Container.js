import React, { PropTypes } from 'react';

import { backgroundColors } from '../constants/styles';

import DocumentTitle from './DocumentTitle';

const Container = ({children, style, title, ...other}) => {
    const styles = {
        root: {
            ...backgroundColors.light,
        },
    };
    const component = (
        <section {...other} style={{...styles.root, ...style}}>
            {children}
        </section>
    );

    // TODO ensure we display a default title
    if (title) {
        return <DocumentTitle title={title}>{component}</DocumentTitle>;
    } else {
        return component;
    };
};

Container.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    title: PropTypes.string,
};

export default Container;
