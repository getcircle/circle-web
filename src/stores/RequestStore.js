class RequestStore {

    constructor() {
        this.bindActions(this.alt.getActions('RequestActions'));
        this.inProgress = false;
    }

    _setInProgress(inProgress: boolean) {
        this.setState({inProgress});
    }

    onStart() {
        this._setInProgress(true);
    }

    onSuccess() {
        this._setInProgress(false);
    }

    onFail() {
        this._setInProgress(false);
    }

}

export default RequestStore;
