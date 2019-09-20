// const files = require.context("./modules/", false, /(\.ts|\.js)$/);
// const modules: any = {};

// /**
//  * @description 自动集成 ./modules 文件夹下的模块
//  */
// files.keys().forEach(key => {
//   modules[key.replace(/(\.\/|\.ts|\.js)/g, "")] = files(key);
// });

// export default modules;

export * from "./modules/user-service";
