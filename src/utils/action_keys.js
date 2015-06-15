import _ from 'lodash';

export default function(obj) {
    let ret = {}
    for (var key of obj) {
        if (Object.hasOwnProperty(key)) {
            ret[key] = _.camelCase(key);
        }
    }
    return ret;
}
