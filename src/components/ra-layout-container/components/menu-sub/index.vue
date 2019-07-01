<template>
  <el-submenu :index="menu.path || uniqueId">
    <template slot="title">
      <i v-if="menu.icon"
         :class="`fa fa-${menu.icon}`" />
      <i v-if="menu.icon === undefined & !menu.iconSvg"
         class="fa fa-folder-o" />
      <span slot="title">{{menu.title}}</span>
    </template>
    <template v-for="(child, childIndex) in menu.children">
      <layout-main-menu-item v-if="child.children === undefined"
                             :menu="child"
                             :key="childIndex" />
      <!-- 自引用组件 -->
      <layout-header-aside-menu-sub v-else
                                    :menu="child"
                                    :key="childIndex" />
    </template>
  </el-submenu>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { uniqueId } from "lodash";
// 组件
import layoutMainMenuItem from "../menu-item/index.vue";

@Component({
  name: "layout-header-aside-menu-sub",
  components: {
    layoutMainMenuItem
  }
})
export default class MenuSub extends Vue {
  uniqueId: string = uniqueId("menu-empty-");
  @Prop({ type: Object, required: false, default: () => {} }) menu: any;
}
</script>
