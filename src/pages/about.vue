<template>
  <div class="about">
    <h1>This is an 2 about page</h1>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
  @Prop({ default: "about -> defaultName" }) name: string;
  created() {
    console.log(this.name);
  }
}
</script>
