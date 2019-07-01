<template>
  <div id="app">
    <!-- <span>国际化翻译eg: -> {{$t("common.btn")}}</span> -->
    <ra-container v-if="$route.meta.withMenu" />
    <router-view v-else />
  </div>
</template>
<script lang="ts">
import { Prop, Watch, PropSync } from "vue-property-decorator";
import Component, { mixins } from "vue-class-component";
import { languageMixin } from "@/mixins/language.mixin";
import { State, Mutation } from "vuex-class";
import { menuAside } from "@/mock/menu";

@Component
export default class HelloWorld extends mixins(languageMixin) {
  @Prop({ default: "1212" }) readonly msg!: string | number;
  @State(state => state.user.info) userInfo!: object;
  @PropSync("name", { type: String, default: "2323" }) _name!: string;
  @Mutation("menu/loadMenu") loadMenu: (menuData: any) => void;
  @Watch("$route")
  routechange(newVal: any) {
    console.log(newVal);
  }
  private created() {
    // this.setLocaleLanguage(); /** 国际化 */
    this.loadMenu(menuAside);
  }
}
</script>

<style lang="scss" >
@import "@/assets/style/index.scss";
</style>
