'use strict';

import Alt from 'alt';


class Flux extends Alt {

	constructor(config = {}) {
		super(config);

		// Register Actions
		this.addActions('AuthActions', require('../actions/AuthActions'));
		this.addActions('RequestsActions', require('../actions/RequestsActions'));

		// Register Stores
		this.addStore('AuthStore', require('../stores/AuthStore'));
	}
}

export default Flux;
