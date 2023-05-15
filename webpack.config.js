const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


module.exports = {
    mode: 'production',
    entry: './scan.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scan.js',
    },
    externals: [nodeExternals()],
    target: 'node',
};