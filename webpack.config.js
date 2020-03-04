const path = require('path');

const isImportableModule = false;

const config = {
    mode: 'production',
    target: "web",
    devtool: false,
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [/src/],
                loader: 'babel-loader'
            }
        ]
    },
    optimization: {
        minimizer: []
    },
    plugins: []
};

if (isImportableModule) config.output.libraryTarget = 'commonjs2';

module.exports = config;
