// 菜单 侧边栏
export const menuAside = [
  {
    title: "系统概览",
    icon: "home",
    path: "/"
  },
  {
    title: "营销管理",
    icon: "car",
    children: [
      {
        path: "/user/sys",
        title: "sys"
      },
      {
        path: "/user/info",
        title: "user info"
      },
      {
        path: "/inventory",
        title: "文章素材"
      }
    ]
  }
];
