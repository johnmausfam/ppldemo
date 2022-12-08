import * as path from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config: webpack.Configuration = {
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    plugins: [new CleanWebpackPlugin() /*new ForkTsCheckerWebpackPlugin({ async: false })*/],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            { test: /\.(?:ico|gif|png|jpg|jpeg|webp|jfif)$/i, type: 'asset/resource' },
        ],
    },
};

export default config;
