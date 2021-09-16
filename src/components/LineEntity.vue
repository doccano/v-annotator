<template>
  <g>
    <geometric-line
      v-for="(range, index) in entity.ranges.items"
      :key="index"
      :x1="x1(range.x1)"
      :x2="x2(range.x2)"
      :y="entity.lineY"
      :color="entity.entityLabel.color"
    />
    <geometric-label-text
      v-if="hasTextLabel"
      :r="entity.entityLabel.circle.radius"
      :x="x1(entity.ranges.first.x1)"
      :y="entity.textY"
      :dx="dx"
      :color="entity.entityLabel.color"
      :rtl="rtl"
      :text="entity.entityLabel.text"
      @click:entity="$emit('click:entity', entity.entity)"
      @contextmenu:entity="$emit('contextmenu:entity', entity.entity)"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import GeometricLabelText from "./GeometricLabelText.vue";
import GeometricLine from "./GeometricLine.vue";
import { GeometricEntity } from "@/domain/models/View/EntityLineView";

export default Vue.extend({
  components: {
    GeometricLabelText,
    GeometricLine,
  },

  props: {
    entity: {
      type: Object as PropType<GeometricEntity>,
      required: true,
    },
    hasTextLabel: {
      type: Boolean,
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
  },

  computed: {
    dx(): number {
      if (this.rtl) {
        return -this.entity.entityLabel.marginLeft;
      } else {
        return this.entity.entityLabel.marginLeft;
      }
    },
  },

  methods: {
    x1(x: number): number {
      return this.rtl ? this.baseX - x : x - this.baseX;
    },
    x2(x: number): number {
      return this.rtl ? this.baseX - x : x - this.baseX;
    },
  },
});
</script>
