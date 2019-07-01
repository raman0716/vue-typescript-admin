<template>
  <div class="layout-header-aside-group">
    <div class="layout-header-aside-content">
      <div class="theme-header">
        <div class="logo-group">
          <img src="/imgs/loading/all.png"
               class="logo" />
          <b class="zone">运营管理后台</b>
        </div>
        <div class="header-right">
          <header-user />
        </div>
      </div>

      <div class="theme-container">
        <div ref="aside"
             class="theme-container-aside">
          <menu-side />
        </div>
        <div class="theme-container-main">
          <transition name="el-fade-in">
            <div class="theme-container-main-layer">
              <div class="theme-container-main-body">
                <transition name="el-zoom-in-center">
                  <!-- routers -->
                  <router-view />
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "element-ui/lib/theme-chalk/base.css";
import MenuSide from "./menu-side/index.vue";
import HeaderUser from "./header-user/index.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "layout-header-aside",
  components: {
    MenuSide,
    HeaderUser
  }
})
export default class HeaderAside extends Vue {
  // [侧边栏宽度] 正常状态
  asideWidth: string = "210px";
  // [侧边栏宽度] 折叠状态
  asideWidthCollapse: string = "65px";
  msgCount: number = 0;
  timer: number = 0;
  unread_count: number = 60;
}
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  justify-content: flex-end;
}
.wait_box {
  margin-right: 10px;
}
.logo {
  width: 50px;
  max-height: 100%;
}
.logo-group {
  display: inline-flex;
  align-items: center;
  img {
    margin-right: 15px;
  }
}
.zone {
  font-size: 20px;
}
</style>
