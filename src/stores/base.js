import {EventEmitter} from 'events';

import dispatcher from '../dispatcher/dispatcher';

const CHANGE_EVENT = 'change';


class BaseStore extends EventEmitter {

    constructor() {
        this.dispatchToken = dispatcher.register((action) => {
            let handler = this[action.type];
            if (typeof handler !== 'undefined' && handler !== null) {
                handler(action);
            } else {
                this.handleAction(action);
            }
        });

    }

    emitChange() {
        this.emit(CHANGE_EVENT);
    }

    // We should be smarter about adding and removing listeners
    // it might be wise to use backbone-events-standalone instead
    // EventEmitter. If you leave an event behind garbage collection
    // issues may ensue.
    addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }

    handleAction(action) {}
}

export default BaseStore;
