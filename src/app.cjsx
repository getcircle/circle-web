fastclick = require 'fastclick'
React = require 'react'

router = require './actions/routing/router'


# export for http://fb.me/react-devtools
window.React = React;

# Touch related
React.initializeTouchEvents(true)
fastclick(document.body)

router.init()

