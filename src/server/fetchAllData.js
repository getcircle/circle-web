import getDataDependencies from '../common/utils/getDataDependencies';

export default function (components, getState, dispatch, location, params, url) {
    return new Promise(resolve => {
        function doTransition() {
            Promise.all(getDataDependencies(components, getState, dispatch, location, params, url, true))
                .then(resolve)
                .catch(error => {
                    // TODO: You may want to handle errors for fetchDataDeferred here
                    console.warn('Warning: Error in fetchDataDeferred', error);
                    return resolve();
                });
        };

        return Promise.all(getDataDependencies(components, getState, dispatch, location, params, url))
            .then(doTransition)
            .catch(error => {
                // TODO: You may want to handle errors for fetchData here
                console.warn('Warning: Error in fetchData', error);
                return doTransition();
            });
    });
};
