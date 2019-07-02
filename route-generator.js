const fs = require('fs-extra');
const path = require('path');
const routeRoot = path.resolve(__dirname, './src/router');
const pageRoot = path.resolve(__dirname, './src/pages');
// 无需menu的路由列表
const withoutMenuList = ['login']
// 不需要加入动态路由的列表
const ignoredFileList = [];
// 存储路由生成
let modules = [];

const stopWalkReg = /component/ig; // 不需要进行递归的文件、文件夹

const walk = function (callback, path = pageRoot) {
  const files = fs.readdirSync(path); // 返回目录名和文件名的字符串数组
  if (stopWalkReg.test(path)) return;
  files.forEach(function (file) {
    if (fs.statSync(path + '/' + file).isFile()) {
      callback(path, file.replace(/\.vue$/i, ''));
    } else {
      const wFolder = path + '/' + file;
      walk(callback, wFolder); // 判断文件夹，继续递归
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
      if (i === 0) {
        tName = param;
      } else {
        tName += '/:' + param
      }
    })
  }
  let pathRes = routePath + '/' + tName;
  // 路由的配置单元模板
  const routeUnit = `{
    path: "${pathRes}",
    name: "${(routePath + '-' + fileName)
      .split('.')[0]
      .replace(/\//g, '-')
      .replace(/^-/, '')}",
    component: () => import("@/pages${routePath}/${fileName}.vue"),
    meta: {
      withMenu: ${withoutMenuList.indexOf(fileName) < 0},
    }
  }`
  // withMenu -> withoutMenuList 取反,首屏刷新显示
  modules.push(routeUnit)
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
