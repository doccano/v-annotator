<template>
  <g>
    <BaseEntityLine
      v-for="([x1, x2], index) in coordinates"
      :key="index"
      :x1="x1"
      :x2="x2"
      :y="lineY"
      :color="color"
      :height="height"
    />
    <BaseEntityText
      v-if="!noText"
      :r="r"
      :x="textX"
      :y="textY"
      :dx="dx"
      :rtl="rtl"
      :text="label"
      :color="color"
      @click:entity="$emit('click:entity')"
      @contextmenu:entity="$emit('contextmenu:entity')"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import BaseEntityText from "./BaseEntityText.vue";
import BaseEntityLine from "./BaseEntityLine.vue";
import { Ranges } from "@/domain/models/Line/EntityLine";
import config from "@/domain/models/Config/Config";

export default Vue.extend({
  components: {
    BaseEntityText,
    BaseEntityLine,
  },

  props: {
    ranges: {
      type: Object as PropType<Ranges>,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    noText: {
      type: Boolean,
      required: false,
    },
    label: {
      type: String,
      required: true,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    baseX: {
      type: Number,
      default: 0,
    },
    lineY: {
      type: Number,
    },
    textY: {
      type: Number,
    },
  },

  computed: {
    dx(): number {
      return this.rtl ? -config.labelMargin : config.labelMargin;
    },
    r(): number {
      return config.radius;
    },
    height(): number {
      return config.lineWidth;
    },
    textX(): number {
      if (this.rtl) {
        return this.x(this.ranges.first.x2);
      } else {
        return this.x(this.ranges.first.x1);
      }
    },
    coordinates(): [number, number][] {
      return this.ranges.items.map((range) => [
        this.x(range.x1),
        this.x(range.x2),
      ]);
    },
  },

  methods: {
    x(x: number): number {
      return x - this.baseX;
    },
  },
});
</script>