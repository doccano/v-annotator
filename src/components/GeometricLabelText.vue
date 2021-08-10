<template>
  <g style="cursor: pointer; userselect: none" @click="$emit('click:entity')">
    <circle :r="r" :fill="color" :cx="cx" :cy="y" />
    <text :x="textX" :y="y" fill="grey" dy="0.35em" v-text="entityLabel.text" />
  </g>
</template>

<script lang="ts">
import { EntityLabel } from "@/domain/models/Line/Shape";
import Vue, { PropType } from "vue";

export default Vue.extend({
  props: {
    x: {
      type: Number,
    },
    y: {
      type: Number,
    },
    entityLabel: {
      type: Object as PropType<EntityLabel>,
    },
  },

  computed: {
    color(): string {
      return this.entityLabel!.circle.color;
    },
    cx(): number {
      return this.x + this.r;
    },
    r(): number {
      return this.entityLabel!.circle.radius;
    },
    textX(): number {
      return this.x + this.entityLabel.marginLeft;
    },
  },
});
</script>
