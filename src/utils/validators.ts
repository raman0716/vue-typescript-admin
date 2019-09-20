
export const emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
export const mailCheck = function (rule: any, value: any, callback: any) {
  if (value && !emailReg.test(value)) {
    callback(new Error("请输入正确邮箱"));
  } else {
    callback();
  }
};