export default [
  {
    path: "/about",
    name: "about",
    component: () => import("@/pages/about.vue"),
    meta: {
      withMenu: true
    }
  },
  {
    path: "/account/register",
    name: "account-register",
    component: () => import("@/pages/account/register.vue"),
    meta: {
      withMenu: true
    }
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/pages/home.vue"),
    meta: {
      withMenu: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login.vue"),
    meta: {
      withMenu: false
    }
  },
  {
    path: "/user/info",
    name: "user-info",
    component: () => import("@/pages/user/info.vue"),
    meta: {
      withMenu: true
    }
  },
  {
    path: "/user/sys",
    name: "user-sys",
    component: () => import("@/pages/user/sys.vue"),
    meta: {
      withMenu: true
    }
  }
];
