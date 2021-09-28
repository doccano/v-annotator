<template>
  <g>
    <path
      :d="d"
      marker-end="url(#arrow)"
      stroke="#74b8dc"
      stroke-width="1"
      fill-opacity="0"
    />
    <rect
      :x="rectX"
      :y="rectY"
      :width="labelWidth"
      :height="fontSize"
      fill="white"
    />
    <text :x="center" :y="textY" text-anchor="middle" v-text="label" />
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
    rtl: {
      type: Boolean,
      default: false,
    },
    baseX: {
      type: Number,
      default: 0,
    },
    margin: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    r(): number {
      return 12;
    },
    y(): number {
      return this.dy + this.fontSize / 2;
    },
    d(): string {
      return `M ${this._x1} ${this.y}
      v -${this.dy}
      A ${this.r} ${this.r} 0 0 1 ${this._x1 + this.r} ${this.lineY}
      H ${this._x2 - this.r}
      A ${this.r} ${this.r} 0 0 1 ${this._x2} ${this.lineY + this.r}
      v ${this.dy - 8}
      `;
    },
    dy(): number {
      return 20 + this.fontSize * this.level;
    },
    center(): number {
      return this._x1 + (this._x2 - this._x1) / 2;
    },
    rectX(): number {
      return this.center - this.labelWidth / 2;
    },
    rectY(): number {
      return this.lineY - this.fontSize / 2;
    },
    lineY(): number {
      return this.y - this.dy - this.r;
    },
    textY(): number {
      return this.lineY + this.fontSize / 2 - 3;
    },
    _x1(): number {
      return this.rtl ? this.x1 - this.margin : this.x1 - this.baseX;
    },
    _x2(): number {
      return this.rtl ? this.x2 - this.margin : this.x2 - this.baseX;
    },
  },
});
</script>
