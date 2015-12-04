class Logger {

    constructor(debug = true) {
        this._debug = debug;
        this._console = console;
    }

    log(message) {
        this._console.log(message);
    }

    error(message, error) {
        this._console.error(message);
    }

    timeStart(key) {
        this._console.time(key);
    }

    timeEnd(key) {
        this._console.timeEnd(key);
    }

    warning(message) {
        this._console.warn(message);
    }

}

export default new Logger();
