import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const files = require.context("./modules", false, /\.ts$/);
const modules: any = {};

/**
 * @description 自动集成 ./modules 文件夹下的模块
 */
files.keys().forEach(
  (key): void => {
    modules[key.replace(/(\.\/|\.ts)/g, "")] = files(key).default;
  }
);

export default new Vuex.Store({
  modules
});
