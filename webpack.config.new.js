/* eslint no-param-reassign: 0 */
// This config is for building dist files
const getWebpackConfig = require('@ant-design/tools/lib/getWebpackConfig');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

const { webpack } = getWebpackConfig;

// 注入less变量
function injectLessVariables(config, variables) {
  (Array.isArray(config) ? config : [config]).forEach(conf => {
    conf.module.rules.forEach(rule => {
      // filter less rule
      if (rule.test instanceof RegExp && rule.test.test('.less')) {
        const lessRule = rule.use[rule.use.length - 1];
        if (lessRule.options.lessOptions) {
          lessRule.options.lessOptions.modifyVars = {
            ...lessRule.options.lessOptions.modifyVars,
            ...variables,
          };
        } else {
          lessRule.options.modifyVars = {
            ...lessRule.options.modifyVars,
            ...variables,
          };
        }
      }
    });
  });

  return config;
}

// 去冗余, moment本地化文件
// noParse still leave `require('./locale' + name)` in dist files
// ignore is better: http://stackoverflow.com/q/25384360
function ignoreMomentLocale(webpackConfig) {
  delete webpackConfig.module.noParse;
  webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
}

// 打包时排除的包
function externalPackages(config, packages) {
  packages.forEach( package => {
    config.externals[package] = {
        root: package,
        commonjs2: package,
        commonjs: package,
        amd: package,
      };
  });
}

// 替换devWarning
function injectWarningCondition(config) {
  config.module.rules.forEach(rule => {
    // Remove devWarning if needed
    if (rule.test.test('test.tsx')) {
      rule.use = [
        ...rule.use,
        {
          loader: 'string-replace-loader',
          options: {
            search: 'devWarning(',
            replace: "if (process.env.NODE_ENV !== 'production') devWarning(",
          },
        },
      ];
    }
  });
}

const legacyEntryVars = {
};

// 注入less变量
const webpackConfig = injectLessVariables(getWebpackConfig(false), legacyEntryVars);

webpackConfig.forEach(config => {
  injectWarningCondition(config);
});

// 生产环境处理
if (process.env.RUN_ENV === 'PRODUCTION') {
  // 遍历配置
  webpackConfig.forEach(config => {
    ignoreMomentLocale(config);// 忽略moment的本地化文件
    externalPackages(config, ['antd', 'moment', 'react', 'react-dom']);// 排除依赖包

    // Reduce non-minified dist files size
    config.optimization.usedExports = true;
    // use esbuild
    // 最小化
    if (process.env.ESBUILD || process.env.CSB_REPO) {
      config.optimization.minimizer[0] = new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      });
    }

    // 分析报告
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: '../report.html',
      }),
    );

    // 冗余检查
    if (!process.env.NO_DUP_CHECK) {
      config.plugins.push(
        new DuplicatePackageCheckerPlugin({
          verbose: true,
          emitError: true,
        }),
      );
    }
  });
}

// 导出
module.exports = [
  ...webpackConfig
];