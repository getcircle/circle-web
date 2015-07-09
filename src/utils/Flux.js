'use strict';

import Alt from 'alt';

class Flux extends Alt {

    constructor(config = {}) {
        super(config);

        // Register Actions
        this.addActions('AuthActions', require('../actions/AuthActions'));
        this.addActions('LocationActions', require('../actions/LocationActions'));
        this.addActions('OrganizationFeedActions', require('../actions/OrganizationFeedActions'));
        this.addActions('ProfileActions', require('../actions/ProfileActions'));
        this.addActions('ProfileFeedActions', require('../actions/ProfileFeedActions'));
        this.addActions('RequestActions', require('../actions/RequestActions'));
        this.addActions('SearchActions', require('../actions/SearchActions'));
        this.addActions('TeamActions', require('../actions/TeamActions'));

        // Register Stores
        this.addStore('AuthStore', require('../stores/AuthStore'));
        this.addStore('LocationStore', require('../stores/LocationStore'));
        this.addStore('OrganizationFeedStore', require('../stores/OrganizationFeedStore'));
        this.addStore('ProfileFeedStore', require('../stores/ProfileFeedStore'));
        this.addStore('ProfileStore', require('../stores/ProfileStore'));
        this.addStore('RequestStore', require('../stores/RequestStore'));
        this.addStore('SearchStore', require('../stores/SearchStore'));
        this.addStore('TeamStore', require('../stores/TeamStore'));
    }
}

export default Flux;
