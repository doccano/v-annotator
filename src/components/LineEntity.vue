<template>
  <g>
    <geometric-line
      :x1="entity.x1"
      :x2="entity.x2"
      :y="entity.lineY"
      :color="entity.entityLabel.color"
    />
    <geometric-label-text
      v-if="hasTextLabel"
      :r="entity.entityLabel.circle.radius"
      :x="entity.x1"
      :y="entity.textY"
      :dx="entity.entityLabel.marginLeft"
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
  },
});
</script>
