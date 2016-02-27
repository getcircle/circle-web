import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { Divider } from 'material-ui';

import t from '../utils/gettext';

const DetailDefaultCollection = ({ collection, ...other }, { muiTheme }) => {
    const styles = {
        container: {
            paddingTop: 20,
        },
        header: {
            fontSize: '2.4rem',
            fontWeight: muiTheme.luno.fontWeights.bold,
            lineHeight: '2.8rem',
        },
        secondaryText: {
            color: muiTheme.luno.colors.lightBlack,
            fontSize: '1.6rem',
            lineHeight: '2.4rem',
        },
    };

    let content;
    content = (
        <span style={styles.secondaryText}>{t('This Collection doesn\'t contain any Knowledge.')}</span>
    );
    return (
        <section {...other}>
            <Divider style={muiTheme.luno.collections.divider} />
            <h1 style={styles.header}>{t('Pinned Knowledge')}</h1>
            <div style={styles.container}>
                {content}
            </div>
        </section>
    );
};

DetailDefaultCollection.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
};

DetailDefaultCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailDefaultCollection;
