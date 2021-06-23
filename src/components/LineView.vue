<template>
  <tspan :x="_x" :dy="_dy">{{ text }}</tspan>
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
    x: {
      type: Number,
      default: 0,
      required: true,
    },
    dy: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  computed: {
    _dy() {
      return this.dy.toString() + "px";
    },
    _x() {
      return this.x.toString() + "px";
    },
  },
});
</script>
