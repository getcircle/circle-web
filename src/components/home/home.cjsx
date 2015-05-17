React = require 'react'
router = require 'flux-react-router'

routes = require '../../constants/route_names'
t = require '../../utils/gettext'

clickActionCreator = require '../../actions/click_action_creator'
clickStore = require '../../stores/click_store'


class Home extends React.Component

    constructor: ->
        this.state = clickStore.toJSON()

    componentDidMount: ->
        clickStore.addChangeListener(this.handleClickStoreChange)

    componentWillUnmount: ->
        clickStore.removeChangeListener(this.handleClickStoreChange)

    handleClickStoreChange: =>
        this.setState clickStore.toJSON()

    handleClick: =>
        # always execute changes through the dispatcher
        # never directly modify the stores
        clickActionCreator.click()

    render: ->
        # sometimes {} doesn't work
        # you can use "#{}" inside double quotes
        # {} is jsx, #{} is coffeescript
        <div className="app">
            <h1>{ t('Test, yo yo yo') }</h1>

            <p>
                <a href="#{ routes.page2 }" onClick={router.deferTo(routes.page2)}>
                    { t('Go to Page 2') }
                </a>
            </p>

            <p>
                <button className='btn' onClick={ @handleClick }>
                    <i className="btn__icon" />
                    <span className='btn__text'>{ t('Increment count') }</span>
                </button>
            </p>

            <p> Click Count: { @state.clickCount } </p>
        </div>

module.exports = Home
