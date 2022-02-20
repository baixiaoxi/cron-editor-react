const webpack = require('webpack')
const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackConfig = {
    entry: './ReactApp.tsx',
    devtool: 'inline-source-map',
    output: {
        filename: 'ReactApp.tsx',
        publicPath: '/',
    },
    mode: 'development',
    devtool: false,
    plugins: [new webpack.SourceMapDevToolPlugin({})],
    devServer: {
        port: 3000,
        open: true,
        host: 'localhost',
        open: ['/index.html'],
        hot: true,
        static: {
            directory: path.join(__dirname, 'dist'),
            publicPath: '/'
        }
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    getCustomTransformers: () => ({
                        before: [tsImportPluginFactory([{
                            libraryName: 'antd',
                            libraryDirectory: 'lib',
                            style: true,
                        }])]
                    }),
                    compilerOptions: {
                        module: 'es2015'
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            }
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
}

module.exports = webpackConfig
