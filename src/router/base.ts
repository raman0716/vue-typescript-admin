// separated from auto ROUTE
module.exports = [
  {
    path: "/snap",
    name: "snap",
    component: () => import("@/pages/snap.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login.vue"),
    meta: {
      withMenu: false,
      // 登录认证 是否需要重定
      auth: true
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/pages/register.vue"),
    meta: {
      withMenu: false,
      // 登录认证 是否需要重定
      auth: true
    }
  },
  {
    path: "*",
    name: "404",
    redirect: "/home"
  }
];
