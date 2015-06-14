ActionTypes = require '../constants/action_types'
client = require '../services/client'
dispatcher = require '../dispatcher/dispatcher'
services = require('protobufs').services

module.exports =

    authenticate: (email, password) ->
        dispatcher.dispatch
            type: ActionTypes.AuthStore.AUTHENTICATION_STARTED

        parameters =
            backend: services.user.actions.authenticate_user.RequestV1.AuthBackendV1.INTERNAL
            credentials:
                key: email
                secret: password
            client_type: services.user.containers.token.ClientTypeV1.WEB
        request = new services.user.actions.authenticate_user.RequestV1(parameters)
        client.sendRequest(request)
            .then((response) ->
                dispatcher.dispatch
                    type: ActionTypes.AuthStore.AUTHENTICATION_COMPLETED
                    result: response.result
            )
            .catch((error) ->
                dispatcher.dispatch
                    type: ActionTypes.AuthStore.AUTHENTICATION_FAILED
                    error: error
            )
