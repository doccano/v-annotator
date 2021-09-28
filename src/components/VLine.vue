<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :direction="direction"
    :id="svgId"
  >
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="6" markerHeight="6"
          orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" stroke="#74b8dc" fill="#74b8dc" />
      </marker>
    </defs>
    <g :transform="translate">
      <BaseRelation
        v-for="relation in lineRelations"
        :key="relation.relation.id"
        :font-size="font.fontSize"
        :x1="relation.x1"
        :x2="relation.x2"
        :level="relation.level"
        :label="relation.label"
        :label-width="relation.labelWidth"
        :rtl="rtl"
        :base-x="baseX"
        :margin="margin"
        :selected="selectedRelation===relation.relation"
        @click:relation="$emit('click:relation', relation.relation)"
        @contextmenu:relation="$emit('contextmenu:relation', relation.relation)"
        @mouseover="selectedRelation=relation.relation"
        @mouseleave="selectedRelation=null"
      />
      <g :transform="translateEntity">
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
          :level="gEntity.level"
          :font-size="font.fontSize"
          :selected="isSelected(gEntity.entity)"
          @click:entity="$emit('click:entity', gEntity.entity)"
          @contextmenu:entity="$emit('contextmenu:entity', gEntity.entity)"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Entity } from "@/domain/models/Label/Entity";
import { Relation } from "@/domain/models/Label/Relation";
import { Font } from "@/domain/models/Line/Font";
import {
  EntityLabelList,
  RelationLabelList,
} from "@/domain/models/Label/Label";
import { TextLine } from "@/domain/models/Line/LineText";
import BaseEntity from "./BaseEntity.vue";
import BaseText from "./BaseText.vue";
import BaseRelation from "./BaseRelation.vue";
import { EntityLine, GeometricEntity } from "@/domain/models/Line/LineEntity";
import { RelationLine, LineRelation } from "@/domain/models/Line/LineRelation";

export default Vue.extend({
  components: {
    BaseEntity,
    BaseText,
    BaseRelation,
  },

  props: {
    entities: {
      type: [] as PropType<Entity[]>,
      default: () => [],
      required: true,
    },
    relations: {
      type: [] as PropType<Relation[]>,
      default: () => [],
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
    relationLabels: {
      type: Object as PropType<RelationLabelList>,
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
      selectedRelation: null as Relation | null,
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
          this.textLine
        );
        return view.render(this.element, this.rtl);
      } else {
        return [];
      }
    },
    lineRelations(): LineRelation[] {
      const view = new RelationLine(this.relations, this.relationLabels, this.textLine);
      return view.render(this.geometricEntities);
    },
    y(): number {
      const level = Math.max(...this.lineRelations.map((item) => item.level));
      if (level < 0) {
        return 0;
      } else {
        return 20 + this.font.fontSize * (level + 1.5);
      }
    },
    translateEntity(): string {
      return `translate(0, ${this.y})`;
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
    isSelected(entity: Entity): boolean {
      if (this.selectedRelation) {
        return this.selectedRelation.fromId === entity.id || this.selectedRelation.toId === entity.id;
      } else {
        return false;
      }
    },
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
