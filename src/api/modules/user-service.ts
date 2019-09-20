// eslint-disable-next-line
import { AxiosRequestConfig } from "axios";
import service from "../axios";

const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig): Promise<any> =>
  service.get(url, { params, ...config });

export function getUrl(params = {}, config = {}) {
  return USER_GET("url", params, config);
}

export function test() {
  console.log("api  test");
}
