declare module "*.png" {
  const value: string;
  export = value;
}
declare module "*.jpg" {
  const value: string;
  export = value;
}
declare module "*.jpeg" {
  const value: string;
  export = value;
}

// 在此只是简单地进行类型描述
declare module "nprogress" {
  export const start: Function;
  export const done: Function;
}
