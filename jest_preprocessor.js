var coffeeReact = require('coffee-react');

module.exports = {
  process: function(src, path) {
    if (path.match(/\.coffee$/) || path.match(/\.cjsx$/)) {
        return coffeeReact.compile(src, {bare: true});
    }
    return src;
  }
};
