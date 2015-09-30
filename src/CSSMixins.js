import autoprefix from 'autoprefix';
import UAParser from 'ua-parser-js';

function memoizedAutoprefix(key) {
    const cache = {};
    return (value) => {
        if (cache[value] === undefined) {
            const reactCSS = {};
            reactCSS[key] = value;
            cache[value] = autoprefix(reactCSS);
        }
        return cache[value];
    }
}

export default {
    alignSelf: memoizedAutoprefix('alignSelf'),
    alignItems: memoizedAutoprefix('alignItems'),
    display: (value) => {

        if (value === 'flex') {
            let browserName = UAParser(window.navigator.userAgent).browser.name;
            if (!!browserName.match('Safari')) {
                value = '-webkit-flex';
            } else if (!!browserName.match('Chrome')) {
                value = 'flex';
            } else {
                // TODO: figure out how to make display work correctly on safari, maybe somehow getting tricky about adding a className to the element so we can do this with css? see: https://github.com/facebook/react/issues/2020#issuecomment
                value = '-webkit-box; display: -moz-box; display: -ms-flexbox; display: -webkit-flex; display: flex';
            }
        }

        return {
            display: value,
        };
    },
    flexDirection: memoizedAutoprefix('flexDirection'),
    flexWrap: memoizedAutoprefix('flexWrap'),
    justifyContent: memoizedAutoprefix('justifyContent'),
}
