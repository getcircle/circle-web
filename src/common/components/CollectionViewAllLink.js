import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { services } from 'protobufs';

import t from '../utils/gettext';
import { getCollectionPath } from '../utils/routes';

const CollectionViewAllLink = ({ collection }, { muiTheme }) => {
    const styles = {
        container: {
            paddingTop: 10,
        },
        link: {
            fontSize: '1.4rem',
            lineHeight: '2.2rem',
            color: muiTheme.luno.tintColor,
            textDecoration: 'none',
        },
    };

    return (
        <div style={styles.container}>
            <Link style={styles.link} to={getCollectionPath(collection)}>
                {t(`View All ${collection.total_items} Resources`)}
            </Link>
        </div>
    );
};

CollectionViewAllLink.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1).isRequired,
};

CollectionViewAllLink.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default CollectionViewAllLink;
