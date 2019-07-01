<template>
  <div class="layout-header-aside-menu-side">
    <el-menu ref="menu"
             :collapse="asideCollapse"
             :unique-opened="true"
             :default-active="active"
             router>
      <template v-for="(menu, menuIndex) in aside">
        <layout-main-menu-item v-if="menu.children === undefined"
                               :menu="menu"
                               :key="menuIndex" />
        <layout-main-menu-sub v-else
                              :menu="menu"
                              :key="menuIndex" />
      </template>
    </el-menu>
    <div v-if="aside.length === 0 && !asideCollapse"
         class="layout-header-aside-menu-empty"
         flex="dir:top main:center cross:center">
      <span>加载中</span>
    </div>
  </div>
</template>

<script lang="ts">
import LayoutMainMenuItem from "../components/menu-item/index.vue";
import LayoutMainMenuSub from "../components/menu-sub/index.vue";
import { State } from "vuex-class";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  name: "layout-header-aside-menu",
  components: {
    LayoutMainMenuItem,
    LayoutMainMenuSub
  }
})
export default class MenuAside extends Vue {
  active: string = "";
  asideHeight: number = 300;
  asideCollapse: boolean = false;
  get menu() {
    // 计算属性
    return this.asideHeight;
  }
  @State(state => state.menu.aside) aside: any;

  @Watch("$route", { immediate: true, deep: true })
  routeChange(newVal: any) {
    const { fullPath } = newVal;
    this.active = fullPath.replace(/\/$/, "");
  }
}
</script>
