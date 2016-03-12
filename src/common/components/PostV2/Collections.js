import { Divider, List, ListItem } from 'material-ui';
import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { routeToCollection } from '../../utils/routes';
import t from '../../utils/gettext';

export const CollectionItem = ({ collection }, { muiTheme }) => {

    let secondaryText;
    const theme = muiTheme.luno.collections;
    const primaryText = <span style={theme.primaryText}>{collection.display_name}</span>;
    const handleTouchTap = () => {
        routeToCollection(collection);
    };


    if (collection.total_items > 1) {
        secondaryText = t(`${collection.total_items} items`);
    } else {
        secondaryText = t('1 item');
    }
    secondaryText = <div><span style={theme.secondaryText}>{secondaryText}</span></div>;

    return (
        <ListItem
            onTouchTap={handleTouchTap}
            primaryText={primaryText}
            secondaryText={secondaryText}
        />
    );

};

CollectionItem.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
};

CollectionItem.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export const Collections = ({ collections, ...other}, { muiTheme }) => {

    let collectionItems;
    const theme = muiTheme.luno.detail;
    const styles = {
        root: {
            background: '#fafafa',
            borderTop: '1px solid #f6f6f6',
            marginTop: 100,
            padding: '80px 0',
        },
        collectionsList: {
            backgroundColor: 'transparent',
        },
        collectionsSection: {
            padding: '0 100px',
        },
    };

    if (collections.length) {
        // TODO: See if we can get correct order from the backend
        collectionItems = collections.reverse().map((item, index) => {
            return (
                <CollectionItem collection={item} key={item.id} />
            );
        });

        return (
            <div style={styles.root}>
                <section className="wrap" style={styles.collectionsSection}>
                    <div style={theme.footer.sectionTitle}>{t('Collected In').toUpperCase()}</div>
                    <Divider style={{...muiTheme.luno.collections.divider, ...{marginTop: 15}}} />
                    <List style={styles.collectionsList}>
                        {collectionItems}
                    </List>
                </section>
            </div>
        );
    } else {
        return <span />;
    }
};


Collections.propTypes = {
    collections: PropTypes.array,
};

Collections.defaultProps = {
    collections: [],
};

Collections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default Collections;
