import React, { PropTypes } from 'react';

import t from '../utils/gettext';

import { showCreateCollectionModal } from '../actions/collections';

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

    function handleNewCollection() { dispatch(showCreateCollectionModal()) };

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

const DetailCollections = ({ collections, hasMore, loaded, loading, onLoadMore }, { muiTheme }) => {

    let menu;
    // TODO permissions check;
    menu = <EditCollectionsMenu />;

    let grid;
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
    }
    return (
        <div>
            <DetailTitle
                IconComponent={CollectionIcon}
                title={t('Collections')}
            >
                {menu}
            </DetailTitle>
            <DetailDefaultCollection />
            {grid}
        </div>
    );
};

DetailCollections.propTypes = {
    collections: PropTypes.array,
    hasMore: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func,
};

DetailCollections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailCollections;
