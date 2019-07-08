import Vue from "vue";
import Router from "vue-router";
import routeAppend from "./route-append";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const baseModule = require("./base.ts");

Vue.use(Router);
const ROUTER = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  // 后使用baseModule 因为404
  routes: [...routeAppend, ...baseModule]
});

// eslint-disable-next-line
ROUTER.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start();
  next();
});

// eslint-disable-next-line
ROUTER.afterEach(to => {
  // 进度条
  NProgress.done();
});

export default ROUTER;
