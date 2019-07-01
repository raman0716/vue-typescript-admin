<template>
  <div class="mr">
    <el-dropdown @command="handleCommand" v-if="!useInfo.avatar">
      <span class="el-link"> {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">个人信息</el-dropdown-item>
        <el-dropdown-item command="b" @click.stop="logOff">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <router-link :to="{ path: '/' }" class="el-link el-link--info">
      <img :src="useInfo.avatar" v-if="useInfo.avatar" />
      <span class="el-link--inner" v-if="info">{{ info.name ? `${info.name}` : "未登录" }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { State } from "vuex-class";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class HeaderUser extends Vue {
  imgObj: any = {};
  userRole: number = 0;
  info: any = {};
  @State(state => state.user.info) useInfo: any;
  get userName() {
    return "John Smith";
  }
  /**
   * @description 登出
   */
  logOff() {
    console.log(this.useInfo, "logout");
  }
  handleCommand(command: string) {
    this.showLog("click on item " + command);
  }
}
</script>
<style lang="scss" scoped>
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 15px;
}
</style>
