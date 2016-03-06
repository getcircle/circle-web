import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import { CREATE_COLLECTION } from '../constants/forms';
import { showFormDialog } from '../actions/forms';

import CollectionIcon from './CollectionIcon';
import DetailDefaultCollection from './DetailDefaultCollection';
import DetailTitle from './DetailTitle';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import MenuItem from './MenuItem';
import InfiniteCollectionsGrid from './InfiniteCollectionsGrid';

const EditCollectionsMenu = (props, { store: { dispatch }, muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );

    function handleNewCollection() { dispatch(showFormDialog(CREATE_COLLECTION)) };

    return (
        <IconMenu iconElement={icon}>
            <MenuItem onTouchTap={handleNewCollection} text={t('New Collection')} />
        </IconMenu>
    );
};

EditCollectionsMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }).isRequired,
};

const DetailCollections = (props, { muiTheme }) => {
    const {
        canEdit,
        collections,
        collectionsCount,
        defaultCollection,
        defaultCollectionLoaded,
        hasMore,
        loaded,
        loading,
        onLoadMore,
    } = props;

    let menu;
    if (canEdit) {
        menu = <EditCollectionsMenu />;
    }

    let grid;
    let collectionsCountString = '';
    if (collections) {
        grid = (
            <InfiniteCollectionsGrid
                collections={collections}
                hasMore={hasMore}
                loaded={loaded}
                loading={loading}
                onLoadMore={onLoadMore}
            />
        );
        collectionsCountString = collectionsCount ? ` (${collectionsCount})` : '';
    }
    return (
        <div>
            <DetailTitle
                IconComponent={CollectionIcon}
                title={t('Collections') + collectionsCountString}
            >
                {menu}
            </DetailTitle>
            <DetailDefaultCollection
                collection={defaultCollection}
                loaded={defaultCollectionLoaded}
            />
            {grid}
        </div>
    );
};

DetailCollections.propTypes = {
    canEdit: PropTypes.bool,
    collections: PropTypes.array,
    collectionsCount: PropTypes.number,
    defaultCollection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    defaultCollectionLoaded: PropTypes.bool,
    hasMore: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func,
};

DetailCollections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailCollections;
