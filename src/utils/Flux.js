'use strict';

import Alt from 'alt';

class Flux extends Alt {

    constructor(config = {}) {
        super(config);

        // Register Actions
        this.addActions('AuthActions', require('../actions/AuthActions'));
        this.addActions('ProfileFeedActions', require('../actions/ProfileFeedActions'));
        this.addActions('OrganizationFeedActions', require('../actions/OrganizationFeedActions'));
        this.addActions('RequestActions', require('../actions/RequestActions'));
        this.addActions('ProfileActions', require('../actions/ProfileActions'));

        // Register Stores
        this.addStore('AuthStore', require('../stores/AuthStore'));
        this.addStore('ProfileFeedStore', require('../stores/ProfileFeedStore'));
        this.addStore('OrganizationFeedStore', require('../stores/OrganizationFeedStore'));
        this.addStore('RequestStore', require('../stores/RequestStore'));
        this.addStore('ProfileStore', require('../stores/ProfileStore'));
    }
}

export default Flux;
