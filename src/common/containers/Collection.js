import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import { provideHooks } from 'redial';
import { services } from 'protobufs';

import { getCollection } from '../actions/collections';
import { resetScroll } from '../utils/window';
import { retrieveCollection } from '../reducers/denormalizations';
import * as selectors from '../selectors';

import Container from '../components/Container';
import CollectionDetail from '../components/CollectionDetail';

const selector = selectors.createImmutableSelector(
    [
        selectors.cacheSelector,
        selectors.routerParametersSelector,
    ],
    (cacheState, parametersState) => {
        const { collectionId } = parametersState;
        const cache = cacheState.toJS();
        const collection = retrieveCollection(collectionId, cache);
        return {
            collection,
        };
    },
);

const hooks = {
    fetch: locals => fetchCollection(locals),
};

function fetchCollection({ dispatch, params: { collectionId } }) {
    return dispatch(getCollection(collectionId));
}

class Collection extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.collectionId !== this.props.params.collectionId) {
            resetScroll();
            fetchCollection(nextProps);
        }
    }

    render() {
        const { collection } = this.props;
        const title = collection ? collection.name : null;
        return (
            <Container title={title}>
                <CollectionDetail
                    collection={collection}
                    itemsLoaded={true}
                    totalItems={0}
                />
            </Container>
        );
    }
}

Collection.propTypes = {
    collection: PropTypes.instanceOf(services.post.containers.CollectionV1),
    dispatch: PropTypes.func.isRequired,
    items: PropTypes.array,
    itemsLoaded: PropTypes.bool,
    params: PropTypes.shape({
        collectionId: PropTypes.string.isRequired,
    }).isRequired,
    totalItems: PropTypes.number,
};

export default provideHooks(hooks)(connect(selector)(Collection));
