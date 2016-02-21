import React, { PropTypes } from 'react';

import {
    Divider,
} from 'material-ui';

import Tabs from './Tabs';

const DetailTabs = ({ children, onRequestChange, slug, ...other}) => {
    const styles = {
        root: {
            padding: '0 100px 0 100px',
            marginBottom: 0,
        },
        tabs: {
            width: 200,
        },
    };

    return (
        <div {...other}>
            <section className="wrap" style={styles.root}>
                <div>
                    <Tabs
                        onRequestChange={onRequestChange}
                        style={styles.tabs}
                        value={slug}
                    >
                        {children}
                    </Tabs>
                </div>
            </section>
            <Divider />
        </div>
    );
};

DetailTabs.propTypes = {
    children: PropTypes.node,
    onRequestChange: PropTypes.func.isRequired,
    slug: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default DetailTabs;
