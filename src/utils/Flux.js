'use strict';

import Alt from 'alt';

class Flux extends Alt {

    constructor(config = {}) {
        super(config);

        // Register Actions
        this.addActions('AuthActions', require('../actions/AuthActions'));
        this.addActions('ProfileActions', require('../actions/ProfileActions'));
        this.addActions('ProfileFeedActions', require('../actions/ProfileFeedActions'));
        this.addActions('OrganizationFeedActions', require('../actions/OrganizationFeedActions'));
        this.addActions('RequestActions', require('../actions/RequestActions'));
        this.addActions('SearchActions', require('../actions/SearchActions'));

        // Register Stores
        this.addStore('AuthStore', require('../stores/AuthStore'));
        this.addStore('ProfileFeedStore', require('../stores/ProfileFeedStore'));
        this.addStore('ProfileStore', require('../stores/ProfileStore'));
        this.addStore('OrganizationFeedStore', require('../stores/OrganizationFeedStore'));
        this.addStore('RequestStore', require('../stores/RequestStore'));
        this.addStore('SearchStore', require('../stores/SearchStore'));
    }
}

export default Flux;
