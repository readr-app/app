
/* eslint "no-console": 0, "import/no-unresolved": 0 */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const request = require('request');
const bodyParser = require('body-parser');
const getConfig = require('./webpack-config');

const supportedSources = (() => {
    try {
        // eslint-disable-next-line global-require
        return require('../server/functions/supported-sources/');
    } catch (err) {
        return () => ([]);
    }
})();
const fetchContents = (() => {
    try {
        // eslint-disable-next-line global-require
        return require('../server/functions/fetch-contents/');
    } catch (err) {
        return (_, fn) => fn({});
    }
})();

const URL = 'https://us-central1-readr-60929.cloudfunctions.net/supportedSources';

const dev = process.env.NODE_ENV !== 'production';

const getList = () => new Promise((resolve, reject) => {
    if (dev) {
        return resolve(supportedSources());
    }
    return request(URL, (err, { statusCode }, sources) => {
        if (err || statusCode !== 200) {
            return reject(err || 'That didn\'t work out so well ...');
        }
        return resolve(JSON.parse(sources));
    });
});

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

const setup = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.post('/api/fetchContents', (req, res) =>
        fetchContents(req.body.url, (err, result) => {
            if (err) {
                return res.status(403).send(err);
            }
            return res.json(result);
        }));
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
        return new WebpackDevServer(webpack(config), Object.assign({ setup }, devServerConfig))
            .listen(port, 'localhost', () =>
                console.log(`Starting server on http://localhost:${port}`));
    }
    return webpack(config).run(handleErrors);
}, console.error);
