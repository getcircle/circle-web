jest.dontMock('../dashboard_actions.coffee')

dashboardActions = require('../dashboard_actions')
renderUtils = require('../../../utils/render')

describe 'DashboardActions', ->

    beforeEach ->
        # renderUtils should be mocked
        # in a real test with some work we can call an
        # action and see some method was run, but for
        # now let's just call .getBody()

        renderUtils.getBody()
        # uncomment to see what happens to things
        # that are auto mocked
        # console.log(renderUtils.getBody)

    it 'runs a coffee test', ->
        expect(true).toBeTruthy()

    it 'calls getBody', ->
        expect(renderUtils.getBody.mock.calls.length).toEqual(2)
