import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { Divider, List } from 'material-ui';

import t from '../utils/gettext';

import CollectionViewAllLink from './CollectionViewAllLink';
import DetailListItemCollection from './DetailListItemCollection';

const DefaultCollection = ({ collection, ...other }) => {
    const items = collection.items.map((item, index) => {
        return (
            <DetailListItemCollection
                item={item}
                key={`default-collection-item-${index}`}
            />
        );
    });

    let viewAll;
    if (collection.total_items > 3) {
        viewAll = <CollectionViewAllLink collection={collection} />;
    }

    return (
        <div>
            <List children={items} {...other} />
            {viewAll}
        </div>
    );
};

const DetailDefaultCollection = ({ collection, loaded, ...other }, { muiTheme }) => {
    const styles = {
        container: {
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

    if (loaded && collection && collection.items && collection.items.length) {
        const content = <DefaultCollection collection={collection} />;
        return (
            <section {...other}>
                <Divider style={{...muiTheme.luno.collections.divider, ...{marginTop: 15}}} />
                <h1 style={styles.header}>{t('Pinned Knowledge')}</h1>
                <div style={styles.container}>
                    {content}
                </div>
            </section>
        );
    } else {
        return <span />;
    }
};

DetailDefaultCollection.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    loaded: PropTypes.bool,
};

DetailDefaultCollection.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailDefaultCollection;
