module.exports =

    getBody: ->
        if not @_body
            @_body = document.getElementsByClassName('js-content')[0]

        return @_body
