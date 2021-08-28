<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g :transform="translate">
      <line-text :spans="textLine.spans" :text="text" />
      <line-entity
        v-for="gEntity in geometricEntities"
        :key="gEntity.entity.id"
        :entity="gEntity"
        @click:entity="$emit('click:entity', $event)"
        @contextmenu:entity="$emit('contextmenu:entity', $event)"
      />
    </g>
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextLine } from "@/domain/models/Line/TextLine";
import LineEntity from "./LineEntity.vue";
import LineText from "./LineText.vue";
import {
  EntityLineView,
  GeometricEntity,
} from "@/domain/models/View/EntityLineView";

export default Vue.extend({
  components: {
    LineEntity,
    LineText,
  },

  props: {
    entities: {
      type: [] as PropType<Entity[]>,
      default: () => [],
      required: true,
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

  data() {
    return {
      height: 0,
    };
  },

  computed: {
    translate(): string {
      return `translate(0, ${this.font.lineHeight})`;
    },
    geometricEntities(): GeometricEntity[] {
      const view = new EntityLineView(
        this.entities,
        this.entityLabels,
        this.textLine,
        this.font
      );
      return view.render(this.text);
    },
  },
});
</script>

<style scoped>
svg {
  white-space: pre;
  overflow-wrap: normal;
  width: 100%;
}
</style>
