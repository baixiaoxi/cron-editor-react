const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const webpackConfig = {
    entry: './src/index.jsx',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({parallel: true}),
            new CssMinimizerPlugin({parallel: true})
        ]
    },
    output: {
        filename: 'index.js',
        library: 'antd-cron',
        libraryTarget: 'umd',
        libraryExport: 'default', // 默认导出
    },
    externals: {
        react: 'react', //打包时候排除react
        antd: 'antd',
        reactDom: 'react-dom',
        moment: 'moment',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: ['babel-loader'],
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
}
module.exports = webpackConfig
