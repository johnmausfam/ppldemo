import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server'; //add devServer to Configuration
import { merge } from 'webpack-merge';
import commonConfig from './webpack.common';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const devBuildPath = path.resolve(__dirname, '../dev');
const config: webpack.Configuration = merge(commonConfig, {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, '../src/index.ts'),
    },
    output: {
        path: devBuildPath,
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    devtool: 'inline-source-map',
    plugins: [
        new HTMLWebpackPlugin({
            title: 'EPIC BATTLES',
            template: path.resolve(__dirname, '../src/static/index.html'),
            filename: 'index.html', // output file
            excludeChunks: ['devtool'],
        }),
    ],
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: false,
        port: 5990,
    },
});

export default config;
