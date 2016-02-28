import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { Divider, List } from 'material-ui';

import t from '../utils/gettext';

import DetailListItemCollection from './DetailListItemCollection';

const DefaultCollection = ({ collection, ...other }) => {
    const items = collection.items.map((item, index) => {
        return (
            <DetailListItemCollection
                className="col-xs-12"
                item={item}
                key={`default-collection-item-${index}`}
            />
        );
    });
    return <List children={items} {...other} />;
};

const DetailDefaultCollection = ({ collection, loaded, ...other }, { muiTheme }) => {
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
    if (loaded && !collection) {
        content = (
            <span style={styles.secondaryText}>{t('This Collection doesn\'t contain any Knowledge.')}</span>
        );
    } else if (collection) {
        content = <DefaultCollection collection={collection} />;
    }

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
    loaded: PropTypes.bool,
};

DetailDefaultCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailDefaultCollection;
