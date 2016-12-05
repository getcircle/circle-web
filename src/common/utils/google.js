export function getAuthInstance() {
    return new Promise((resolve, reject) => {
        if (!window.gapi) {
            return reject(new Error('GAPI_FAILURE'));
        }

        window.gapi.load('auth2', () => {
            let instance = window.gapi.auth2.getAuthInstance();
            if ( instance === null) {
                instance = window.gapi.auth2.init({
                    /*eslint-disable camelcase*/
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    /*eslint-enable camelcase*/
                });
            }
            resolve({instance});
        });
    });
}

export function login() {
    return getAuthInstance().then(({instance}) => {
        return instance.grantOfflineAccess({
            /*eslint-disable camelcase*/
            redirect_uri: 'postmessage',
            /*eslint-enable camelcase*/
        });
    });
}

export function logout() {
    return getAuthInstance().then(({instance}) => {
        if (instance.isSignedIn.get()) {
            return instance.signOut();
        } else {
            return Promise.resolve();
        }
    });
}
