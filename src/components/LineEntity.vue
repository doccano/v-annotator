<template>
  <g>
    <g v-for="ge in geometricEntities" :key="ge.entity.id">
      <geometric-line
        :x1="ge.x1"
        :x2="ge.x2"
        :y="ge.lineY"
        :color="ge.entityLabel.color"
      />
      <geometric-label-text
        v-if="canDisplayText(ge.entity)"
        :x="ge.x1"
        :y="ge.textY"
        :entityLabel="ge.entityLabel"
        @click:entity="$emit('click:entity', ge.entity)"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextLine } from "@/domain/models/Line/TextLine";
import {
  EntityLineView,
  GeometricEntity,
} from "@/domain/models/View/EntityLineView";
import GeometricLabelText from "./GeometricLabelText.vue";
import GeometricLine from "./GeometricLine.vue";

export default Vue.extend({
  components: {
    GeometricLabelText,
    GeometricLine,
  },

  props: {
    entities: {
      type: [] as PropType<Entity[]>,
      default: () => [],
      required: true,
    },
    showLabelText: {
      type: Boolean,
      default: true,
      required: false,
    },
    textLine: {
      type: Object as PropType<TextLine>,
      required: true,
    },
    font: {
      type: Object as PropType<Font>,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    entityLabels: {
      type: Object as PropType<EntityLabels>,
      required: true,
    },
  },

  computed: {
    geometricEntities(): GeometricEntity[] {
      const view = new EntityLineView(
        this.entities,
        this.entityLabels,
        this.textLine,
        this.font,
        this.showLabelText
      );
      return view.render(this.text);
    },
  },

  methods: {
    canDisplayText(entity: Entity): boolean {
      // Do not show a label text if the entity continues from the previous line.
      const startsWithLine = this.textLine.startOffset <= entity.startOffset;
      return this.showLabelText && startsWithLine;
    },
  },
});
</script>
