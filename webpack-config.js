
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const posthtmlExpressions = require('posthtml-expressions');
const manifest = require('./config/manifest');

const SRC_PATH = path.join(__dirname, 'src');
const DIST_PATH = path.join(__dirname, 'dist');

const LEGACY_MANIFEST_FILE = `legacy-${Date.now()}.appcache`;
const MANIFEST_LOADER = `manifestloader-${Date.now()}.html`;
const COMMIT_SHA = process.env.CI_COMMIT_ID || Date.now();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';
const cssClassHash = '[hash:base64:5]';
const localIdentName = isProd ? cssClassHash : `[local]___${cssClassHash}`;
const cssLoader = {
    loader: 'css-loader',
    query: {
        modules: true,
        importLoaders: 1,
        localIdentName,
    },
};

const plugins = [
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
        __DEV__: JSON.stringify(!isProd),
        __PROD__: JSON.stringify(isProd),
        __COMMIT_SHA__: JSON.stringify(COMMIT_SHA),
        MANIFEST_LOADER: JSON.stringify(MANIFEST_LOADER),
    }),
    new HtmlWebpackPlugin({
        template: path.join(SRC_PATH, 'index.ejs'),
        minify: {
            collapseWhitespace: isProd,
        },
        manifestLoader: MANIFEST_LOADER,
        shouldIncludeTracking: isProd,
        manifest,
    }),
    new HtmlWebpackPlugin({
        template: path.join(SRC_PATH, 'webmanifest.ejs'),
        filename: 'manifest.webmanifest',
        inject: false,
        manifest,
    }),
    new webpack.LoaderOptionsPlugin({
        test: /\.sass$/,
        options: {
            sassLoader: {
                indentedSyntax: true,
                outputStyle: 'compressed',
            },
        },
    }),
    new webpack.LoaderOptionsPlugin({
        test: /\.(png|jpe?g|gif)$/,
        options: {
            fileLoader: {
                name: '[sha512:hash:base64:7].[ext]',
            },
        },
    }),
    new webpack.LoaderOptionsPlugin({
        test: /\.svg$/,
        options: {
            urlLoader: {
                name: '[sha512:hash:base64:7].[ext]',
                limit: 1024 * 10,
            },
        },
    }),
    new AppCachePlugin({
        cache: [],
        network: ['*'],
        fallback: ['/ index.html'],
        settings: ['fast'],
        exclude: [
            /iconstats-[a-z0-9]+\.json$/i,
            /readr_apple.*\.png$/i,
            /readr_android-chrome.*\.png$/i,
            'readr_manifest.json',
            /sw\.js$/,
        ],
        output: LEGACY_MANIFEST_FILE,
    }),
    new ServiceWorkerWebpackPlugin({
        entry: path.join(SRC_PATH, 'modules', 'cache', 'sw.js'),
        publicPath: '/',
        excludes: [
            'legacy-*.appcache',
            'readr_android*.png',
            'readr_apple*.png',
            'readr_manifest.json',
            'iconstats-*.json',
        ],
    }),
];
const prodPlugins = !isProd ? [] : [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
            comments: false,
        },
    }),
    new FaviconsWebpackPlugin({
        logo: path.join(__dirname, 'assets', 'readr-app-icon.png'),
        prefix: 'readr_',
        title: manifest.name,
        emitStats: false,
        persistentCache: false,
        background: manifest.theme_color,
        icons: {
            android: true,
            appleIcon: false,
            appleStartup: true,
            coast: false,
            favicons: true,
            firefox: false,
            opengraph: true,
            twitter: false,
            yandex: false,
            windows: false,
        },
    }),
    new HtmlWebpackPlugin({
        template: path.join(SRC_PATH, 'manifestloader.ejs'),
        filename: MANIFEST_LOADER,
        minify: {
            collapseWhitespace: isProd,
        },
        inject: false,
        appCacheFile: LEGACY_MANIFEST_FILE,
    }),
];

module.exports = (supportedSources, bail) => {

    const supportedSites = supportedSources
        .map(name => `&nbsp;&bull;&nbsp;${name}`)
        .join('<br>');
    const postHtmlOptions = new webpack.LoaderOptionsPlugin({
        options: {
            posthtml: {
                plugins: [
                    posthtmlExpressions({
                        locals: { supportedSites },
                    }),
                ],
            },
        },
    });

    return {

        target: 'web',

        context: SRC_PATH,

        entry: path.resolve(SRC_PATH, 'index.js'),

        output: {
            path: DIST_PATH,
            publicPath: '/',
            filename: '[name].[hash].js',
        },

        module: {
            rules: [{
                test: /\.js$/,
                use: ['source-map-loader'],
                exclude: /node_modules/,
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: [/node_modules/, /__tests__/],
            }, {
                test: /\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    cssLoader,
                    'postcss-loader',
                    'sass-loader',
                ],
            }, {
                test: /\.(png|jpe?g|gif)$/,
                use: ['file-loader'],
            }, {
                test: /\.markup\.svg$/,
                use: ['html-loader', 'markup-inline-loader'],
            }, {
                test: /\.file\.svg$/,
                use: ['url-loader'],
            }, {
                test: /\.md$/,
                use: [
                    { loader: 'html-loader', options: { minimize: isProd } },
                    'posthtml-loader',
                    'markdown-loader',
                ],
            }],
        },

        resolve: {
            extensions: ['.js', '.jsx'],
        },

        devServer: {
            contentBase: DIST_PATH,
            inline: true,
            clientLogLevel: 'error',
            historyApiFallback: true,
            port: 8090,
            stats: { colors: true },
        },

        devtool: !isProd && 'source-map',

        plugins: plugins.concat([postHtmlOptions]).concat(prodPlugins),

        bail,

    };

};
