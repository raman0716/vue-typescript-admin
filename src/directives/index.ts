import Vue from "vue";
import { formatNum } from "@/utils/format.ts";
const { set } = require("lodash");

/**
 * @description 自定义 限制输入框 只能输入数字 且 限制后几位
 * @param 0 1 2 （默认保留两位）
 * @example  <el-input v-model="ruleForm.fee" v-formatNum:2="ruleForm.fee" />
 *
 */
Vue.directive("formatNum", {
  update(el, { value, expression, arg }, { context }) {
    let keys = expression.split(".");
    value && set(context, keys, formatNum(value, arg));
  }
});
