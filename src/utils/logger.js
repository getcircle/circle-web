class Logger {

    constructor(debug = true) {
        this._debug = debug;
        this._console = console;
    }

    log(message) {
        this._console.log(message);
    }

    error(message) {
        this._console.error(message);
    }

}

export default new Logger();
