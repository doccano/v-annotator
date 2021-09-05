<template>
  <g>
    <geometric-line
      :x1="x1"
      :x2="x2"
      :y="entity.lineY"
      :color="entity.entityLabel.color"
    />
    <geometric-label-text
      v-if="hasTextLabel"
      :r="entity.entityLabel.circle.radius"
      :x="x1"
      :y="entity.textY"
      :dx="dx"
      :color="entity.entityLabel.color"
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
    x: {
      type: Number,
      default: 0,
    },
  },

  created() {
    console.log(this.x1, this.x2, this.x2 - this.x1)
  },

  computed: {
    x1(): number {
      return this.rtl ? this.x - this.entity.x1 : this.entity.x1;
    },
    x2(): number {
      return this.rtl ? this.x - this.entity.x2 : this.entity.x2;
    },
    dx(): number {
      return this.rtl ? 0 : this.entity.entityLabel.marginLeft;
    },
  },
});
</script>
