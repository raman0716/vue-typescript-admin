// eslint-disable-next-line
import Vue, { VNode } from "vue";
// import VueI18n from "vue-i18n"; /** 国际化 */

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
} // 声明全局方法
declare module "vue/types/vue" {
  interface Vue {
    showLog: Function;
    showMSg: Function;
    // $t: typeof VueI18n.prototype.t; /** 国际化 */
  }
}