'use strict';

class Logger {

	constructor(debug = true) {
		this._debug = debug;
	}

	log(message) {
		/*eslint-disable no-console*/
		console.log(message);
		/*eslint-enable no-console*/
	}

}

export default new Logger();
