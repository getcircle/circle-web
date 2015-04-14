ReactRouter = require 'flux-react-router'

dashboard = require('./dashboard_urls')(ReactRouter)


# MonkeyPatching ReactRouter to preventDefault
# This allows our <a> tags to stay a bit more semantic
# and accounts for potential server side loading.
oldDeferTo = ReactRouter.deferTo
ReactRouter.deferTo = (name) ->
    callback = oldDeferTo(name)
    (e) ->
        e.preventDefault()
        callback()


module.exports = ReactRouter
