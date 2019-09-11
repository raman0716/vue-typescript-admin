const fs = require('fs-extra');
const path = require('path');
const routeRoot = path.resolve(__dirname, './src/router');
const pageRoot = path.resolve(__dirname, './src/pages');
// 无需menu的路由列表
const withoutMenuList = ['login']
// 不需要加入动态路由的列表
const ignoredFileList = [];
const baseModule = require('./src/router/base.ts');
baseModule.forEach(e => {
  ignoredFileList.push(e.name)
})

// 存储路由生成
let modules = [];

const stopWalkReg = /(component|style|scss|const|mixin)/ig; // 不需要进行递归的文件、文件夹
// mac系统文件不解析
const reg = /\.DS_Store/i;

const walk = function (callback, path = pageRoot) {
  const files = fs.readdirSync(path); // 返回目录名和文件名的字符串数组
  stopWalkReg.lastIndex = 0;
  if (stopWalkReg.test(path)) return;
  files.forEach(function (file) {
    stopWalkReg.lastIndex = 0;
    if (fs.statSync(path + '/' + file).isFile()) {
      if (!reg.test(file)) {
        callback(path, file.replace(/\.vue$/i, ''));
      }
    } else {
      const wFolder = path + '/' + file;
      if (!reg.test(wFolder)) {
        walk(callback, wFolder); // 判断文件夹，继续递归
      }
    }
  });
}

/**
 * @description 自动集成 @/pages 文件夹下的模块
 * @param actualPath 绝对路径
 * @param fileName 文件名，已经去掉.vue后缀
 */
walk((actualPath, fileName) => {
  if (ignoredFileList.indexOf(fileName) > -1) return;

  let routePath = actualPath.replace(pageRoot, '');
  let tName = fileName;
  if (fileName.includes('.')) {
    fileName.split('.').forEach((param, i) => {
      if (param.includes('$')) { // 增加非必选参数 param$，比如新增和编辑在同一个页面
        let tj = param.split('$');
        if (i === 0) {
          tName = tj[0];
        } else {
          tName += `/:${tj[0]}?`
        }
      } else {
        if (i === 0) {
          tName = param;
        } else {
          tName += '/:' + param
        }
      }
    })
  }
  let pathRes = routePath + '/' + tName;
  // 路由的配置单元模板
  const name = `${(routePath + '-' + fileName)
    .split('.')[0]
    .replace(/\//g, '-')
    .replace(/^-/, '')}`;
  /**
   * @description routeUnit规则
   * @meta withMenu -> withoutMenuList 取反,首屏刷新显示
   * @meta ignoreCollapseMenu 带参数的路由(详情页)不需要关闭菜单
   */
  const routeUnit = `{
    path: "${pathRes}",
    name: "${name}",
    component: () => import("@/pages${routePath}/${fileName}.vue"),
    meta: {
      withMenu: ${withoutMenuList.indexOf(fileName) < 0},
      ignoreCollapseMenu: ${fileName.indexOf(".") > 0},
    }
  }`

  if (ignoredFileList.indexOf(name) < 0) {
    modules.push(routeUnit)
  }
})

const insertRes = `export default [
  ${modules}
]`

fs.writeFileSync(
  `${routeRoot}/route-append.ts`,
  insertRes,
  {
    encoding: 'utf8',
    mode: 438 /* =0666*/,
    flag: 'w'
  }
)
