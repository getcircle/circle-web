var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
module.exports = {
    assets: {
        images: {
            extensions: [
                'jpeg',
                'jpg',
                'png',
                'gif'
            ],
            parser: WebpackIsomorphicToolsPlugin.url_loader_parser
        },
        svg: {
            extension: 'svg',
            parser: WebpackIsomorphicToolsPlugin.url_loader_parser
        },
        styles: {
            extensions: ['scss'],
            filter: function(module, regex, options, log) {
                if (options.development) {
                    return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
                }
            },
            path: WebpackIsomorphicToolsPlugin.style_loader_path_extractor,
            parser: WebpackIsomorphicToolsPlugin.css_loader_parser
        }
    }
}
