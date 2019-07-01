import Vue from "vue";
import Router from "vue-router";
import routeAppend from "./route-append";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [...routeAppend]
});
