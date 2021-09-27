<template>
  <g>
    <path
      :d="d"
      marker-end="url(#arrow)"
      stroke="black"
      stroke-width="2"
      fill-opacity="0"
    />
    <rect
      :x="rectX"
      :y="rectY"
      :width="labelWidth"
      :height="fontSize"
      fill="white"
    />
    <text
      :x="center"
      :y="textY"
      text-anchor="middle"
      v-text="label"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({

  props: {
    fontSize: {
      type: Number,
      required: true,
    },
    x1: {
      type: Number,
      required: true,
    },
    x2: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    labelWidth: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    r(): number {
      return 12;
    },
    y(): number {
      return 0;
    },
    d(): string {
      return `M ${this.x1} ${this.y}
      v -${this.dy}
      A ${this.r} ${this.r} 0 0 1 ${this.x1 + this.r} ${this.lineY}
      H ${this.x2 - this.r}
      A ${this.r} ${this.r} 0 0 1 ${this.x2} ${this.lineY + this.r}
      v ${this.dy}
      `;
    },
    dy(): number {
      return 50 + this.fontSize * this.level;
    },
    center(): number {
      return this.x1 + (this.x2 - this.x1) / 2;
    },
    rectX(): number {
      return this.center - this.labelWidth / 2;
    },
    rectY(): number {
      return this.lineY - this.fontSize / 2
    },
    lineY(): number {
      return this.y - this.dy - this.r;
    },
    textY(): number {
      return this.lineY + this.fontSize / 2 - 3;
    },
  },
});
</script>
