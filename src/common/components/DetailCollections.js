import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import t from '../utils/gettext';

import { CREATE_COLLECTION, REORDER_COLLECTIONS } from '../constants/forms';
import { showFormDialog } from '../actions/forms';

import CollectionIcon from './CollectionIcon';
import DetailDefaultCollection from './DetailDefaultCollection';
import DetailTitle from './DetailTitle';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import MenuItem from './MenuItem';
import InfiniteCollectionsGrid from './InfiniteCollectionsGrid';
import ReorderCollectionsForm from './ReorderCollectionsForm';

const { OwnerTypeV1 } = services.post.containers.CollectionV1;

const EditCollectionsMenu = ({ hasCollections }, { store: { dispatch }, muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );

    function handleNewCollection() { dispatch(showFormDialog(CREATE_COLLECTION)) };
    function handleReorderCollections() { dispatch(showFormDialog(REORDER_COLLECTIONS)) };

    let rearrange;
    if (hasCollections) {
        rearrange = <MenuItem onTouchTap={handleReorderCollections} text={t('Rearrange')} />;
    }

    return (
        <IconMenu iconElement={icon}>
            {rearrange}
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

EditCollectionsMenu.propTypes = {
    hasCollections: PropTypes.bool,
};

const EmptyState = () => {
    const styles = {
        text: {
            fontSize: '1.6rem',
        },
        textRow: {
            padding: 30,
        },
    };
    return (
        <div>
            <div className="row center-xs" style={styles.textRow}>
                <span style={styles.text}>{t('No collections added yet.')}</span>
            </div>
        </div>
    );
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
        ownerId,
        ownerType,
    } = props;

    let menu;
    let form;
    if (canEdit) {
        const hasCollections = loaded && collections && !!collections.length;
        menu = <EditCollectionsMenu hasCollections={hasCollections} />;
        if (hasCollections) {
            form = (
                <ReorderCollectionsForm
                    collections={collections}
                    ownerId={ownerId}
                    ownerType={ownerType}
                />
            );
        }
    }

    let grid, pinnedKnowledgeCollection, emptyState;
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

    if (defaultCollection && defaultCollection.items && defaultCollection.items.length) {
        pinnedKnowledgeCollection = (
            <DetailDefaultCollection
                collection={defaultCollection}
                loaded={defaultCollectionLoaded}
            />
        );
    }

    if (defaultCollectionLoaded && (!defaultCollection.items || !defaultCollection.items.length) && !collections) {
        emptyState = <EmptyState />;
    }

    return (
        <div>
            <DetailTitle
                IconComponent={CollectionIcon}
                title={t('Collections') + collectionsCountString}
            >
                {menu}
            </DetailTitle>
            {pinnedKnowledgeCollection}
            {grid}
            {emptyState}
            {form}
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
    ownerId: PropTypes.string.isRequired,
    ownerType: PropTypes.oneOf(Object.values(OwnerTypeV1)),
};

DetailCollections.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default DetailCollections;
