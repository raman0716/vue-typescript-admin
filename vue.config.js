const TerserPlugin = require('terser-webpack-plugin');

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir);

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss');

// 基础路径 注意发布之前要先修改这里
let publicPath = '/';
const PROXY = {
  // target: "http://47.103.38.157", // dev
  target: 'http://47.97.156.80:8080', // test
  changeOrigin: true
};
module.exports = {
  publicPath, // 根据你的实际情况更改这里
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    publicPath, // 和 publicPath 保持一致
    proxy: {
      '/system-admin-service': PROXY,
      '/user-service': PROXY,
      '/vehicle-service': PROXY,
      '/order-service': PROXY,
      '/file-service': PROXY
    }
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        data: `@import '~@/assets/style/public-variables.scss';`
      }
    }
  },
  configureWebpack: config => {
    // 入口文件
    config.entry.app = ['babel-polyfill', './src/main.ts'];
    config.watchOptions = {

    }
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('prefetch').delete('preload');
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve.symlinks(true);
    config
      // 开发环境
      .when(
        process.env.NODE_ENV === 'development',
        // sourcemap不包含列信息
        config => config.devtool('cheap-source-map')
      )
      // 非开发环境
      .when(process.env.NODE_ENV !== 'development', config => {
        config.optimization.minimizer([
          new TerserPlugin({
            extractComments: true,
            cache: true,
            parallel: 4,
            sourceMap: false,
            terserOptions: {
              // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              extractComments: 'all',
              compress: {
                drop_console: true,
              },
            }
          })
        ]);
      });
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end();
    // svg
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'lcj-[name]'
      })
      .end();
    // image exclude
    const imagesRule = config.module.rule('images');
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve('src/assets/svg-icons/icons'))
      .end();
    // node
    config.node.set('__dirname', true).set('__filename', true);
  }
};
