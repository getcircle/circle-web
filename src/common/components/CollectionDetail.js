import React, { PropTypes } from 'react';
import { services } from 'protobufs';

import { showConfirmDeleteModal, showEditCollectionModal } from '../actions/collections';
import t from '../utils/gettext';

import CollectionIcon from './CollectionIcon';
import DetailContent from './DetailContent';
import DetailDivider from './DetailDivider';
import DetailHeader from './DetailHeader';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import MenuItem from './MenuItem';

const EditCollectionMenu = ({ collection }, { store: { dispatch }, muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );

    function handleDelete() { dispatch(showConfirmDeleteModal(collection)); }
    function handleEdit() { dispatch(showEditCollectionModal()); }

    return (
        <IconMenu iconElement={icon}>
            <MenuItem onTouchTap={handleEdit} text={t('Edit Collection')} />
            <MenuItem onTouchTap={handleDelete} text={t('Delete Collection')} />
        </IconMenu>
    );
};

EditCollectionMenu.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1).isRequired,
};

EditCollectionMenu.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
    }),
};

const CollectionDetailHeader = ({ collection }) => {
    let primaryText, secondaryText;
    if (collection) {
        primaryText = collection.name;
    }
    return (
        <DetailHeader
            Icon={CollectionIcon}
            primaryText={primaryText}
            secondaryText={secondaryText}
        />
    );
}

CollectionDetailHeader.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
};

const CollectionDetailKnowledge = ({ items, itemsLoaded }, { muiTheme }) => {
    let content;
    const styles = {
        noContent: {
            fontSize: '1.6rem',
            color: muiTheme.luno.colors.lightBlack,
            lineHeight: '2.4rem',
        },
    };
    if ((!items || !items.length) && itemsLoaded) {
        content = (
            <div>
                <span style={styles.noContent}>{t('This Collection doesn\'t contain any Knowledge.')}</span>
            </div>
        );
    }
    return (
        <div>
            {content}
        </div>
    );
};

CollectionDetailKnowledge.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

CollectionDetailKnowledge.propTypes = {
    items: PropTypes.array,
    itemsLoaded: PropTypes.bool,
};

const CollectionDetailTitle = ({ collection, itemsLoaded, totalItems, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
    const styles = {
        divider: {
            backgroundColor: muiTheme.luno.colors.black,
            height: 2,
            marginTop: 45,
            marginBottom: 20,
        },
    };
    // TODO if items have loaded, display totalItems next to knowledge
    return (
        <section {...other}>
            <div className="row middle-xs">
                <h1 style={theme.h1}>{t('Knowledge')}</h1>
                { /* TODO add permissions check */ }
                <EditCollectionMenu collection={collection} />
            </div>
            <DetailDivider style={styles.divider} />
        </section>
    );
};

CollectionDetailTitle.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    items: PropTypes.array,
    itemsLoaded: PropTypes.bool,
};

CollectionDetailTitle.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const CollectionDetail = ({ collection, items, itemsLoaded, totalItems }) => {
    return (
        <div>
            <CollectionDetailHeader collection={collection} />
            <DetailContent>
                <CollectionDetailTitle
                    collection={collection}
                    itemsLoaded={itemsLoaded}
                    totalItems={totalItems}
                />
                <CollectionDetailKnowledge
                    items={items}
                    itemsLoaded={itemsLoaded}
                    totalItems={totalItems}
                />
            </DetailContent>
        </div>
    );
};

CollectionDetail.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    item: PropTypes.array,
    itemsLoaded: PropTypes.bool,
    totalItems: PropTypes.number,
};

CollectionDetail.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default CollectionDetail;
