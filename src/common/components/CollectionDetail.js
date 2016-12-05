import React, { PropTypes } from 'react';
import { services } from 'protobufs';
import { Link } from 'react-router';

import { showConfirmDeleteModal } from '../actions/collections';
import t from '../utils/gettext';
import { getProfilePath, getTeamPath } from '../utils/routes';
import { EDIT_COLLECTION } from '../constants/forms';
import { showFormDialog } from '../actions/forms';

import CollectionIcon from './CollectionIcon';
import DetailContent from './DetailContent';
import DetailDivider from './DetailDivider';
import DetailHeader from './DetailHeader';
import EditIcon from './EditIcon';
import IconMenu from './IconMenu';
import InfiniteCollectionItemList from './InfiniteCollectionItemList';
import LightBulbIcon from './LightBulbIcon';
import MenuItem from './MenuItem';

const EditCollectionMenu = ({ collection }, { store: { dispatch }, muiTheme }) => {
    const icon = (
        <EditIcon stroke={muiTheme.luno.tintColor} />
    );

    function handleDelete() { dispatch(showConfirmDeleteModal(collection)); }
    function handleEdit() { dispatch(showFormDialog(EDIT_COLLECTION)); }

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

const CollectionDetailHeader = ({ collection }, { muiTheme }) => {
    let primaryText, secondaryText;
    if (collection && collection.name) {
        primaryText = collection.name;
    }

    if (!primaryText) {
        primaryText = t('Pinned Knowledge');
    }

    const styles = {
        link: {
            color: muiTheme.luno.colors.white,
            fontWeight: muiTheme.luno.fontWeights.black,
        },
    };

    if (collection && collection.owner) {
        let main, byLine;
        switch (collection.owner) {
        case 'team':
            main = <span>{t('Curated in ')}</span>;
            byLine = (
                <Link
                    className="detail-header-link"
                    style={styles.link}
                    to={getTeamPath(collection.team)}
                >
                    {collection.team.name}
                </Link>
            );
            break;
        case 'profile':
            main = <span>{t('Curated by ')}</span>;
            byLine = (
                <Link
                    className="detail-header-link"
                    style={styles.link}
                    to={getProfilePath(collection.profile)}
                >
                    {collection.profile.full_name}
                </Link>
            );
            break;
        }
        secondaryText = <span>{main}{byLine}</span>;
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

CollectionDetailHeader.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const CollectionDetailKnowledge = ({ items, loaded, loading, nextRequest, onLoadMore }, { muiTheme }) => {
    let content;
    const styles = {
        noContent: {
            fontSize: '1.6rem',
            color: muiTheme.luno.colors.lightBlack,
            lineHeight: '2.4rem',
        },
    };
    if ((!items || (items && !items.length)) && loaded) {
        content = (
            <div>
                <span style={styles.noContent}>{t('This Collection doesn\'t contain any Knowledge.')}</span>
            </div>
        );
    } else if (items && items.length) {
        content = (
            <InfiniteCollectionItemList
                hasMore={!!nextRequest}
                items={items}
                loading={loading}
                onLoadMore={onLoadMore}
            />
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
    loaded: PropTypes.bool,
    loading: PropTypes.bool,
    nextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
};

const CollectionDetailTitle = ({ collection, itemsLoaded, totalItems, ...other }, { muiTheme }) => {
    const theme = muiTheme.luno.detail;
    let menu;
    if (collection && collection.permissions && collection.permissions.can_edit) {
        menu = <EditCollectionMenu collection={collection} />;
    }

    const itemsCountString = totalItems && itemsLoaded ? ` (${totalItems})` : '';
    return (
        <section {...other}>
            <div className="row middle-xs">
                <LightBulbIcon />
                <h1 style={theme.h1}>{t('Knowledge')}{itemsCountString}</h1>
                {menu}
            </div>
            <DetailDivider style={{...muiTheme.luno.collections.divider, ...{marginTop: 15}}} />
        </section>
    );
};

CollectionDetailTitle.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    itemsLoaded: PropTypes.bool,
    totalItems: PropTypes.number,
};

CollectionDetailTitle.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

const CollectionDetail = (props) => {
    const {
        collection,
        items,
        itemsLoaded,
        itemsLoading,
        itemsNextRequest,
        onLoadMore,
        totalItems,
    } = props;
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
                    loaded={itemsLoaded}
                    loading={itemsLoading}
                    nextRequest={itemsNextRequest}
                    onLoadMore={onLoadMore}
                    totalItems={totalItems}
                />
            </DetailContent>
        </div>
    );
};

CollectionDetail.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    items: PropTypes.array,
    itemsLoaded: PropTypes.bool,
    itemsLoading: PropTypes.bool,
    itemsNextRequest: PropTypes.object,
    onLoadMore: PropTypes.func,
    totalItems: PropTypes.number,
};

CollectionDetail.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default CollectionDetail;
