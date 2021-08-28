<template>
  <g
    style="cursor: pointer; userselect: none"
    @click="$emit('click:entity')"
    @contextmenu.prevent="$emit('contextmenu:entity')"
  >
    <circle :r="r" :fill="color" :cx="cx" :cy="y" />
    <text :x="x" :y="y" fill="grey" :dx="dx" dy="0.35em" v-text="text" />
  </g>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    r: {
      type: Number,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    dx: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },

  computed: {
    cx(): number {
      return this.x + this.r;
    },
  },
});
</script>
