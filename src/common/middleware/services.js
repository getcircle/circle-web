export const SERVICE_REQUEST = 'Service Request';

export default function createServicesMiddleware(client) {
    return store => next => action => {
        const request = action[SERVICE_REQUEST];
        if (typeof request === 'undefined') {
            return next(action);
        }

        const {
            types,
            remote,
            bailout = () => false,
        } = request;
        const { dispatch, getState } = store;

        if (!types) {
            // Normal action: pass it on
            return next(action);
        }

        if (!Array.isArray(types) || !(types.length >= 3)) {
            throw new Error('Expected an array of at least three action types.');
        }

        if (!types.every(type => typeof type === 'string')) {
            throw new Error('Expected action types to be strings.');
        }

        if (typeof remote !== 'function') {
            throw new Error('Expected remote to be a function.');
        }

        if (typeof bailout !== 'undefined' && typeof bailout !== 'function') {
            throw new Error('Expected bailout to be a function or undefined');
        }

        function actionWith(data) {
            const finalAction = Object.assign({}, action, data);
            delete finalAction[SERVICE_REQUEST];
            return finalAction;
        }

        const [requestType, successType, failureType, bailType] = types;

        const bail = bailout(getState());
        if (!!bail) {
            if (bailType && typeof bail === 'object') {
                next(actionWith({type: bailType, payload: bail}));
            }
            return;
        }

        next(actionWith({type: requestType}));

        return remote(client, getState(), dispatch).then(
            response => next(actionWith({
                type: successType,
                payload: Object.assign({}, action.payload, response),
            })),
            error => next(actionWith({
                type: failureType,
                error: true,
                payload: error,
            }))
        )
    }
}
