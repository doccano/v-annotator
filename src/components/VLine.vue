<template>
  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" :direction="direction">
    <g :transform="translate">
      <line-text :id="id" :text-line="textLine" :text="text" />
      <line-entity
        v-for="gEntity in geometricEntities"
        :key="gEntity.entity.id"
        :ranges="gEntity.ranges"
        :color="color(gEntity.entity)"
        :label="labelText(gEntity.entity)"
        :no-text="noText(gEntity.entity)"
        :rtl="rtl"
        :base-x="baseX"
        :line-y="gEntity.lineY"
        :text-y="gEntity.textY"
        @click:entity="$emit('click:entity', gEntity.entity)"
        @contextmenu:entity="$emit('contextmenu:entity', gEntity.entity)"
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
    rtl: {
      type: Boolean,
      default: false,
    },
    baseX: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      element: null as SVGTextElement | null,
    };
  },

  mounted() {
    this.setElement();
  },

  watch: {
    textLine: {
      handler() {
        this.setElement();
      },
      deep: true,
    },
  },

  computed: {
    translate(): string {
      return `translate(0, ${this.font.lineHeight})`;
    },
    geometricEntities(): GeometricEntity[] {
      if (this.element) {
        const view = new EntityLineView(
          this.entities,
          this.entityLabels,
          this.textLine,
          this.font
        );
        return view.render(this.element);
      } else {
        return [];
      }
    },
    direction(): string {
      return this.rtl ? "rtl" : "ltr";
    },
    id(): string {
      return `${this.textLine.startOffset}:${this.textLine.endOffset}`;
    },
  },

  methods: {
    noText(entity: Entity): boolean {
      // Do not show a label text if the entity continues from the previous line.
      return entity.startOffset < this.textLine.startOffset;
    },
    setElement() {
      this.$nextTick(() => {
        this.element = document.getElementById(
          this.id
        ) as unknown as SVGTextElement;
      });
    },
    color(entity: Entity): string {
      return this.entityLabels.getColor(entity.label);
    },
    labelText(entity: Entity): string {
      return this.entityLabels.getText(entity.label);
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
