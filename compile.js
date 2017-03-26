
/* eslint "no-console": 0 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const request = require('request');
const getConfig = require('./webpack-config');

const URL = 'https://us-central1-readr-60929.cloudfunctions.net/supportedSources';

const getList = () => new Promise((resolve, reject) =>
    request(URL, (err, { statusCode }, sources) => {
        if (err || statusCode !== 200) {
            return reject(err || 'That didn\'t work out so well ...');
        }
        return resolve(JSON.parse(sources));
    }));

const handleErrors = (err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        process.exit(-1);
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        console.error(info.errors);
        process.exit(-1);
    }

    if (stats.hasWarnings()) {
        console.warn(info.warnings);
        process.exit(-1);
    }
};

getList().then((list) => {
    const watch = process.argv.includes('--watch');
    const config = getConfig(list, !watch);
    const { port } = config.devServer;
    const devServerConfig = Object.assign({}, config.devServer, {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
        },
    });

    if (watch) {
        return new WebpackDevServer(webpack(config), devServerConfig)
            .listen(port, 'localhost', () =>
                console.log(`Starting server on http://localhost:${port}`));
    }
    return webpack(config).run(handleErrors);
}, console.error);
