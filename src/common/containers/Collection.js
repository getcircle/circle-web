import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';
import { browserHistory } from 'react-router';

import { hideConfirmDeleteModal, getCollection, deleteCollection, getCollectionItems } from '../actions/collections';
import { resetScroll } from '../utils/window';
import { retrieveCollection, retrieveCollectionItems } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
import CollectionDetail from '../components/CollectionDetail';
import DeleteCollectionConfirmation from '../components/DeleteCollectionConfirmation';
import EditCollectionForm from '../components/EditCollectionForm';

const REQUIRED_FIELDS = ['permissions'];

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
        selectors.deleteCollectionSelector,
        selectors.collectionItemsSelector,
    ],
    (cacheState, parametersState, deleteCollectionState, collectionItemsState) => {
        let items, itemsLoaded, itemsLoading, itemsNextRequest, totalItems;
        const { collectionId } = parametersState;
        const cache = cacheState.toJS();
        const collection = retrieveCollection(collectionId, cache);

        if (collectionItemsState.has(collectionId)) {
            const ids = collectionItemsState.get(collectionId).get('ids');
            if (ids.size) {
                items = retrieveCollectionItems(ids.toJS(), cache);
                itemsNextRequest = collectionItemsState.get(collectionId).get('nextRequest');
            }
            itemsLoading = collectionItemsState.get(collectionId).get('loading');
            itemsLoaded = collectionItemsState.get(collectionId).get('loaded');
            totalItems = collectionItemsState.get(collectionId).get('count');
        }

        return {
            collection,
            items,
            itemsLoaded,
            itemsLoading,
            itemsNextRequest,
            totalItems,
            pendingCollectionToDelete: deleteCollectionState.get('pendingCollectionToDelete'),
        };
    },
);

const hooks = {
    fetch: locals => fetchCollection(locals),
    defer: locals => fetchCollectionItems(locals),
};

function fetchCollection({ dispatch, params: { collectionId } }) {
    return dispatch(getCollection(collectionId, REQUIRED_FIELDS));
}

function fetchCollectionItems({ dispatch, params: { collectionId } }) {
    return dispatch(getCollectionItems(collectionId));
}

function loadCollection(locals) {
    fetchCollection(locals);
    fetchCollectionItems(locals);
}

class Collection extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.collectionId !== this.props.params.collectionId) {
            resetScroll();
            loadCollection(nextProps);
        }
    }

    handleLoadMore = () => {
        const { dispatch, collection, itemsNextRequest } = this.props;
        dispatch(getCollectionItems(collection.id, itemsNextRequest));
    }

    handleDeleteCollectionRequestClose = () => {
        this.props.dispatch(hideConfirmDeleteModal());
    }

    handleDeleteCollection = () => {
        const { dispatch, pendingCollectionToDelete } = this.props;
        dispatch(hideConfirmDeleteModal());
        dispatch(deleteCollection(pendingCollectionToDelete));
        browserHistory.goBack();
    }

    render() {
        const {
            collection,
            dispatch,
            items,
            itemsLoaded,
            itemsLoading,
            itemsNextRequest,
            pendingCollectionToDelete,
            totalItems,
        } = this.props;
        const title = collection ? collection.name : null;

        let forms;
        if (collection) {
            forms = (
                <div>
                    <DeleteCollectionConfirmation
                        collection={pendingCollectionToDelete}
                        onRequestClose={this.handleDeleteCollectionRequestClose}
                        onSave={this.handleDeleteCollection}
                        open={!!pendingCollectionToDelete}
                    />
                    <EditCollectionForm
                        collection={collection}
                        dispatch={dispatch}
                    />
                </div>
            );
        }
        return (
            <Container title={title}>
                <CollectionDetail
                    collection={collection}
                    items={items}
                    itemsLoaded={itemsLoaded}
                    itemsLoading={itemsLoading}
                    itemsNextRequest={itemsNextRequest}
                    onLoadMore={this.handleLoadMore}
                    totalItems={totalItems}
                />
                {forms}
            </Container>
        );
    }
}

Collection.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    itemsLoaded: PropTypes.bool,
    itemsLoading: PropTypes.bool,
    itemsNextRequest: PropTypes.object,
    params: PropTypes.shape({
        collectionId: PropTypes.string.isRequired,
    }).isRequired,
    pendingCollectionToDelete: PropTypes.instanceOf(services.post.containers.CollectionV1),
    totalItems: PropTypes.number,
};

export default provideHooks(hooks)(connect(selector)(Collection));
