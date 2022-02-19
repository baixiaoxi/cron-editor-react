const webpack = require('webpack')
const path = require('path');

const webpackConfig = {
    entry: './index.js',
    output: {
        filename: 'index.js',
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
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                [
                                    'import',
                                    {
                                        libraryName: 'antd',
                                        libraryDirectory: 'lib',
                                        style: true,
                                    },
                                ],
                            ],
                        },
                    },
                ],
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
        extensions: ['.js', '.jsx'],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
}

module.exports = webpackConfig
