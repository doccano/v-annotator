<template>
  <tspan :dx="dx" v-text="text" />
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    dx: {
      type: Number,
      default: 0,
      required: true,
    },
  },
});
</script>
