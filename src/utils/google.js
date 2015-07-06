'use strict';

export function getAuthInstance() {
    return new Promise((resolve, reject) => {
        window.gapi.load('auth2', () => {
            let instance = window.gapi.auth2.getAuthInstance();
            if ( instance === null) {
                instance = window.gapi.auth2.init({
                    /*eslint-disable camelcase*/
                    // TODO: should be coming from settings
                    client_id: '1077014421904-1a697ks3qvtt6975qfqhmed8529en8s2.apps.googleusercontent.com',
                    scope: (
                        'https://www.googleapis.com/auth/plus.login ' +
                        'https://www.googleapis.com/auth/plus.profile.emails.read'
                    ),
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
