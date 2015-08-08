import Immutable from 'immutable';

export default function serviceRequest({ dispatch, getState }) {
    return function (next) {
        return function (action) {
            const {
                types,
                fetch,
                shouldFetch = () => true,
                payload = {},
            } = action;

            if (!types) {
                // Normal action: pass it on
                return next(action);
            }

            if (
                !Array.isArray(types) ||
                types.length !== 3 ||
                !types.every(type => typeof type === 'string')
            ) {
                throw new Error('Expected an array of three string types');
            }

            if (typeof fetch != 'function') {
                throw new Error('Expected fetch to be a function');
            }

            if (!shouldFetch(getState())) {
                return;
            }

            const [requestType, successType, failureType] = types;

            dispatch({
                type: requestType,
                payload: payload,
            });

            return fetch(getState()).then(
                response => dispatch({
                    type: successType,
                    payload: Object.assign({}, payload, response),
                }),
                error => dispatch({
                    type: failureType,
                    error: true,
                    payload: error,
                })
            )
        }
    }

}