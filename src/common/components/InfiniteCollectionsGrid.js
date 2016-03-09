import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { Divider } from 'material-ui';

import t from '../utils/gettext';
import { getPostPath, getCollectionPath } from '../utils/routes';

import CollectionViewAllLink from './CollectionViewAllLink';
import InfiniteGrid from './InfiniteGrid';

const CollectionsGridItem = ({ collection, ...other }, { muiTheme }) => {
    const styles = {
        header: {
            color: muiTheme.luno.colors.black,
            fontSize: '2.4rem',
            fontWeight: muiTheme.luno.fontWeights.bold,
            lineHeight: '2.8rem',
            textDecoration: 'none',
        },
        items: {
            paddingTop: 10,
        },
        title: {
            fontSize: '1.4rem',
            lineHeight: '2.2rem',
            color: muiTheme.luno.colors.lightBlack,
            textDecoration: 'none',
        },
    };

    let items;
    if (!collection.total_items) {
        items = <span style={styles.title}>{t('No Knowledge')}</span>
    } else {
        const titles = collection.items.map((item, index) => {
            return (
                <li key={`collection-item-${index}`}>
                    <Link style={styles.title} to={getPostPath(item.post)}>{item.post.title}</Link>
                </li>
            );
        });
        items = <ul>{titles}</ul>;
    }

    let viewAll;
    if (collection.total_items > 3) {
        viewAll = <CollectionViewAllLink collection={collection} />;
    }

    return (
        <div {...other}>
            <Divider style={muiTheme.luno.collections.divider} />
            <Link style={styles.header} to={getCollectionPath(collection)}>{collection.name}</Link>
            <div style={styles.items}>
                {items}
            </div>
            {viewAll}
        </div>
    );
};

CollectionsGridItem.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const InfiniteCollectionsGrid = ({ collections, ...other }) => {
    const items = collections.map((c, i) => {
        return (
            <CollectionsGridItem
                className="col-xs-4"
                collection={c}
                key={`detail-list-item-collection-${i}`}
            />
        );
    });
    return <InfiniteGrid children={items} {...other} />;
};

export default InfiniteCollectionsGrid;
