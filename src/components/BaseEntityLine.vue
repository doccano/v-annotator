<template>
  <line
    :x1="_x1"
    :y1="y"
    :x2="_x2"
    :y2="y"
    :stroke="color"
    :stroke-width="height"
    stroke-linecap="round"
  />
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    x1: {
      type: Number,
    },
    x2: {
      type: Number,
    },
    y: {
      type: Number,
    },
    height: {
      type: Number,
      default: 5,
    },
    color: {
      type: String,
    },
  },

  computed: {
    _x1(): number {
      const x = this.x1 < this.x2 ? this.x1 : this.x2;
      return x + this.height / 2;
    },
    _x2(): number {
      const x = this.x1 < this.x2 ? this.x2 : this.x1;
      return x - this.height / 2;
    },
  },
});
</script>
