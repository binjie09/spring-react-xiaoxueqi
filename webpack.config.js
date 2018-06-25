var path = require('path');

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },

        ],
        rules: [
            // .js(x) loading
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            // Ignore the .babelrc at the root of our project-- that's only
                            // used to compile our webpack settings, NOT for bundling
                            babelrc: false,
                            presets: [
                                ['env', {
                                    // Enable tree-shaking by disabling commonJS transformation
                                    modules: false,
                                    // Exclude default regenerator-- we want to enable async/await
                                    // so we'll do that with a dedicated plugin
                                    exclude: ['transform-regenerator'],
                                }],
                                // Transpile JSX code
                                'react',
                            ],
                            plugins: [
                                'transform-object-rest-spread',
                                'syntax-dynamic-import',
                                'transform-regenerator',
                                'transform-class-properties',
                                'transform-decorators-legacy',
                            ],
                        },
                    },
                ],
            },
        ]
    }
};