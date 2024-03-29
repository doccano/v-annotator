<template>
  <g
    style="cursor: pointer; userselect: none"
    @click="$emit('click:relation', $event)"
    @contextmenu="$emit('contextmenu:relation')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <path
      :d="d"
      v-bind="markerObj"
      stroke="#74b8dc"
      :stroke-width="width"
      fill="none"
    />
    <g v-if="x1">
      <rect
        :x="rectX"
        :y="rectY"
        :width="labelWidth"
        :height="fontSize"
        :fill="fill"
      />
      <text
        :x="center"
        :y="textY"
        fill="currentColor"
        text-anchor="middle"
        v-text="label"
      />
    </g>
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
    },
    x2: {
      type: Number,
    },
    dark: {
      type: Boolean,
      default: false,
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
    openLeft: {
      type: Boolean,
      default: false,
    },
    openRight: {
      type: Boolean,
      default: false,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    margin: {
      type: Number,
      default: 0,
    },
    marker: {
      type: String,
    },
    maxLevel: {
      type: Number,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    r(): number {
      return 12;
    },
    y(): number {
      return 20 + this.fontSize * this.maxLevel + this.fontSize / 2;
    },
    d(): string {
      if (this.openLeft && this.openRight) {
        return `M ${this._x1} ${this.y - this.dy - this.r}
        H ${this._x2}
        `;
      } else if (this.openLeft) {
        return `M ${this._x1} ${this.y - this.dy - this.r}
        H ${this._x2 - this.r}
        A ${this.r} ${this.r} 0 0 1 ${this._x2} ${this.lineY + this.r}
        v ${this.dy - 3}
        `;
      } else if (this.openRight) {
        return `M ${this._x1} ${this.y}
        v -${this.dy}
        A ${this.r} ${this.r} 0 0 1 ${this._x1 + this.r} ${this.lineY}
        H ${this._x2}
        `;
      } else {
        return `M ${this._x1} ${this.y}
        v -${this.dy}
        A ${this.r} ${this.r} 0 0 1 ${this._x1 + this.r} ${this.lineY}
        H ${this._x2 - this.r}
        A ${this.r} ${this.r} 0 0 1 ${this._x2} ${this.lineY + this.r}
        v ${this.dy - 3}
        `;
      }
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
      return this.x1 - this.margin;
    },
    _x2(): number {
      return this.x2 - this.margin;
    },
    width(): number {
      return this.selected ? 3 : 1;
    },
    markerObj() {
      if (this.marker === "start") {
        return { "marker-start": "url(#v-annotator-arrow)" };
      } else if (this.marker === "end") {
        return { "marker-end": "url(#v-annotator-arrow)" };
      } else {
        return {};
      }
    },
    fill(): string {
      return this.dark ? "#1E1E1E" : "white";
    },
  },
});
</script>
