import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import { i18n } from "./locale"; /** 国际化 */
import appMixin from "@/mixins/app.mixin";
import "./plugins/element-ui";
import "./plugins/ra-container";

Vue.config.productionTip = false;
Vue.mixin(appMixin);

new Vue({
  // i18n, /** 国际化 */
  router,
  store,
  render: h => h(App)
}).$mount("#app");
