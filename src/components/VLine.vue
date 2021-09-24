<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :direction="direction"
    :id="svgId"
  >
    <g :transform="translate">
      <BaseText :id="id" :text-line="textLine" :text="text" :x="baseX" />
      <BaseEntity
        v-for="gEntity in geometricEntities"
        :key="gEntity.entity.id"
        :ranges="gEntity.ranges"
        :color="color(gEntity.entity)"
        :label="labelText(gEntity.entity)"
        :no-text="noText(gEntity.entity)"
        :rtl="rtl"
        :base-x="baseX"
        :margin="margin"
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
import { EntityLabelList } from "@/domain/models/Label/Label";
import { TextLine } from "@/domain/models/Line/TextLine";
import BaseEntity from "./BaseEntity.vue";
import BaseText from "./BaseText.vue";
import { EntityLine, GeometricEntity } from "@/domain/models/Line/LineEntity";

export default Vue.extend({
  components: {
    BaseEntity,
    BaseText,
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
      type: Object as PropType<EntityLabelList>,
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
    margin: {
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
    entities: {
      handler() {
        this.$nextTick(() => {
          const svg = document.getElementById(
            this.svgId
          ) as unknown as SVGSVGElement;
          const height = svg.getBBox().height + 30;
          svg.setAttribute("style", `height: ${height}px`);
          this.$emit("update:height", this.id, height);
        });
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {
    translate(): string {
      return `translate(0, ${this.font.lineHeight})`;
    },
    geometricEntities(): GeometricEntity[] {
      if (this.element) {
        const view = new EntityLine(
          this.entities,
          this.entityLabels,
          this.textLine,
          this.font
        );
        return view.render(this.element, this.rtl);
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
    svgId(): string {
      return "svg" + this.id;
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
