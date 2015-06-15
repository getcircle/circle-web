import _ from 'lodash';

export default function(obj) {
    let ret = {}
    for (let key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key)) {
            ret[key] = _.camelCase(key);
        }
    }
    return ret;
}
