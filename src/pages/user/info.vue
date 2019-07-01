<template>
  <div>
    info
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {
  @Prop({ default: "about -> defaultName" }) name: string;
  created() {}
}
</script>
