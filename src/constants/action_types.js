import actionKeys from '../utils/action_keys'

ActionTypes = {
    AuthStore: actionKeys({
        AUTHENTICATION_STARTED: null,
        AUTHENTICATION_COMPLETED: null,
        AUTHENTICATION_FAILED: null
    })
}

export default ActionTypes;
