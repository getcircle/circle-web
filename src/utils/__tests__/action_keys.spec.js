jest
    .dontMock('../action_keys')
    .dontMock('lodash');

const actionKeys = require('../action_keys');

describe('actionKeys', () => {

    it('returns camel case values', () => {
        values = actionKeys({
            SOME_KEY: null
        });

        expect(values.SOME_KEY).toEqual('someKey');
    });

});
