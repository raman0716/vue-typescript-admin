// 数字小数位数格式化
export const formatNum = function(str: string, float: number | undefined | string = 2) {
  if (!str) return;
  str = str.toString();
  if (str.length > 1 && str.charAt(0) === "0" && str.charAt(1) !== ".") {
    return "";
  }
  const i = str.indexOf(".");
  let arr;
  if (i !== -1) {
    str.replace(/./g, "$");
    str.replace(/./g, "");
    str.replace(/$/g, ".");
    arr = str.split(".");
    str = arr[0];
  }
  const reg = /[^0-9]*/g;
  let newStr = str.replace(reg, "");
  newStr = float === 0 ? str.slice(0, str.length) : newStr;
  const newStrFlot: any = arr && arr[1].replace(reg, "");
  return float !== "0" && i !== -1 ? newStr + "." + newStrFlot.slice(0, float) : newStr;
};

/**
 * @description 数字千分位格式化
 * @param value 原始值
 * @param fixed 保留的位数
 */
export const divideNumber = function(value: number | string, fixed: number = 0) {
  value = Number(value).toFixed(fixed);
  let [pre, end] = value.split(".");
  if (pre.length <= 3) {
    return value;
  } else {
    if (!end) value = value + ".0";
    let res = value.replace(/(\d)(?=(\d{3})+\.)/g, "$1,").split(".")[0];
    if (end && fixed < end.length) {
      end = end.substr(0, fixed);
    }
    return fixed > 0 ? `${res}.${(end || "").padEnd(fixed, "0")}` : res;
  }
};
