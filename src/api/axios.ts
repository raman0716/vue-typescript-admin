import axios from "axios";
// import router from '@/router';
import { Message } from "element-ui";

const baseURL = process.env.VUE_APP_API;

const service = axios.create({
  baseURL,
  timeout: 30000 // 请求超时时间
});
// 请求拦截器
service.interceptors.request.use(
  config => {
    let token = "x-Token";
    // 请求携带token-- ['X-AUTH-TOKEN']为自定义key
    config.headers["X-AUTH-TOKEN"] = token;
    return config;
  },
  error => {
    // 发送失败
    console.error(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { code, msg } = response.data;
    if (code === undefined) {
      return response.data;
    } else {
      switch (code) {
        case "000000":
          return response;
        case "010028":
          return response;
        default:
          Message.error({
            message: msg
          });
          return response;
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "账号异常，请联系管理员";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
    }
    Message.warning(error.message);
    return Promise.reject(error);
  }
);

export default service;
