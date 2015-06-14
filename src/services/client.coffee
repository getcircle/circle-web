_ = require 'lodash'
requests = require 'superagent'
protobufs = require 'protobufs'
RSVP = require 'rsvp'


ENVIRONMENTS =
    local: 'local'
    production: 'production'


class WrappedResponse
    # XXX include the serviceRequest
    constructor: (@httpResponse) ->
        @response = protobufs.soa.ServiceResponseV1.decode(@httpResponse.xhr.response)
        @result = @_getResult()
        @errors = @_getErrors()
        @errorDetails = @_getErrorDetails()

    _getResponseExtensionName: (action) ->
        basePath = protobufs.services.registry.responses.$type.fqn()
        [basePath, _.capitalize(action.control.service), action.control.action].join '.'

    _getResult: ->
        action = @response.actions[0]
        action.result[@_getResponseExtensionName(action)]

    _getErrors: ->
        action = @response.actions[0]
        action.result.errors

    _getErrorDetails: ->
        action = @response.actions[0]
        action.result.error_details


class Transport
    constructor: (@token) ->

    environment: ENVIRONMENTS.local

    _getScheme: ->
        switch @environment
            when ENVIRONMENTS.local then 'http'
            else 'https'

    _getHost: ->
        switch @environment
            when ENVIRONMENTS.local then 'localhost:8000'
            else 'api.circlehq.co'

    _getServiceEndpoint: ->
        "#{ @_getScheme() }://#{ @_getHost() }"

    sendRequest: (serializedRequest) ->
        deferred = RSVP.defer()
        # TODO set authorization header for authenticated requests
        requests
            .post(@_getServiceEndpoint())
            .type('application/x-protobuf')
            .send(serializedRequest)
            .responseType('arraybuffer')
            .end((err, res) ->
                if err
                    deferred.reject err
                else
                    # TODO should reject with failures from the service
                    # TODO should handle any decoding errors
                    response = new WrappedResponse(res)
                    deferred.resolve response
            )
        deferred.promise


class Client
    constructor: ->
        @transport = new Transport()

    buildRequest: (action, params) ->
        # $type.fqn is something like ".services.user.actions.get_active_devices.RequestV1"
        service = params.$type.fqn().split('.')[2]
        actionExtensionName = @_getRequestExtensionName(service, action)

        serviceControl = new protobufs.soa.ControlV1({service: service, token: @token})
        serviceRequest = new protobufs.soa.ServiceRequestV1({control: serviceControl})

        actionControl = new protobufs.soa.ActionControlV1({service: service, action: action})
        actionParams = new protobufs.soa.ActionRequestParamsV1()
        # TODO this should raise an exception if we can't find
        # actionExtensionName within the actionRequestParams object, i'm not
        # sure what the proper way to do that in JS land is
        actionParams[actionExtensionName] = params

        actionRequest = new protobufs.soa.ActionRequestV1({control: actionControl, params: actionParams})
        serviceRequest.actions.push(actionRequest)
        serviceRequest.toArrayBuffer()

    sendRequest: (protobufRequest) ->
        serializedRequest = @buildRequest(protobufRequest.$type.parent.name, protobufRequest)
        @transport.sendRequest(serializedRequest)

    _getRequestExtensionName: (service, action) ->
        basePath = protobufs.services.registry.requests.$type.fqn()
        [basePath, _.capitalize(service), action].join '.'

    setToken: (token) ->
        @transport.token = token

module.exports = new Client()
