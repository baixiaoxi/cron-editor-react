const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path/posix");
const TerserPlugin = require('terser-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');

const webpackConfig = {
    entry: './src/index.tsx',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({parallel: true}),
            new CssMinimizerPlugin({parallel: true})
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
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
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
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
        extensions: ['.ts', '.tsx', '.js'],
    },
}
module.exports = webpackConfig
