<template>
  <el-menu-item :index="menu.path || uniqueId">
    <i v-if="menu.icon"
       :class="`fa fa-${menu.icon}`"></i>
    <i v-if="menu.icon === undefined & !menu.iconSvg"
       class="fa fa-file-o" />
    <span slot="title">{{menu.title || '未命名菜单'}}</span>
  </el-menu-item>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { uniqueId } from "lodash";

@Component({
  name: "layout-header-aside-menu-item"
})
export default class MenuItem extends Vue {
  uniqueId: string = uniqueId("menu-empty-");
  @Prop({ type: Object, required: false, default: () => {} }) menu: any;
}
</script>
