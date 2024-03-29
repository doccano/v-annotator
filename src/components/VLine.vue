<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :direction="direction"
    :id="svgId"
    width="100%"
  >
    <g :transform="translate">
      <BaseRelation
        v-for="relation in lineRelations"
        :key="relation.relation.id"
        :dark="dark"
        :font-size="font.fontSize"
        :x1="relation.x1"
        :x2="relation.x2"
        :level="relation.level"
        :label="relation.label"
        :label-width="relation.labelWidth"
        :marker="relation.marker"
        :max-level="maxRelationLevel"
        :openLeft="relation.openLeft"
        :openRight="relation.openRight"
        :rtl="rtl"
        :margin="left"
        :selected="isSelectedRelation(relation.relation)"
        @click:relation="$emit('click:relation', $event, relation.relation)"
        @contextmenu:relation="$emit('contextmenu:relation', relation.relation)"
        @mouseover="$emit('setSelectedRelation', relation.relation)"
        @mouseleave="$emit('setSelectedRelation', null)"
      />
      <g :transform="translateEntity">
        <BaseText
          :id="basetextId"
          :text-line="textLine"
          :text="text"
          :x="baseX"
        />
        <BaseEntity
          v-for="gEntity in geometricEntities"
          :key="gEntity.entity.id"
          :ranges="gEntity.ranges"
          :color="color(gEntity.entity)"
          :label="labelText(gEntity.entity)"
          :no-text="noText(gEntity.entity)"
          :rtl="rtl"
          :margin="left"
          :level="gEntity.level"
          :font-size="font.fontSize"
          :selected="isSelectedEntity(gEntity.entity)"
          @click:entity="$emit('click:entity', $event, gEntity.entity)"
          @contextmenu:entity="$emit('contextmenu:entity', gEntity.entity)"
          @mouseover="$emit('setSelectedEntity', gEntity.entity)"
          @mouseleave="$emit('setSelectedEntity', null)"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Entity } from "@/domain/models/Label/Entity";
import { RelationListItem } from "@/domain/models/Label/Relation";
import { Font } from "@/domain/models/Line/Font";
import { LabelList } from "@/domain/models/Label/Label";
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
    annotatorUuid: {
      type: String,
      required: true,
    },
    entities: {
      type: [] as PropType<Entity[]>,
      default: () => [],
      required: true,
    },
    relations: {
      type: [] as PropType<RelationListItem[]>,
      default: () => [],
    },
    textLine: {
      type: Object as PropType<TextLine>,
      required: true,
    },
    dark: {
      type: Boolean,
      default: false,
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
      type: Object as PropType<LabelList>,
      required: true,
    },
    relationLabels: {
      type: Object as PropType<LabelList>,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
    baseX: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    selectedEntities: {
      type: Array as PropType<Entity[]>,
    },
    selectedRelation: {
      type: Object as PropType<RelationListItem | null>,
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
        const view = new EntityLine(this.textLine, this.rtl);
        return view.render(this.element, this.entities, this.entityLabels);
      } else {
        return [];
      }
    },
    lineRelations(): LineRelation[] {
      const view = new RelationLine(
        this.relations,
        this.relationLabels,
        this.textLine,
        this.left,
        this.right
      );
      return view.render(this.geometricEntities, this.rtl);
    },
    maxRelationLevel(): number {
      return Math.max(...this.lineRelations.map((r) => r.level), 0);
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
    basetextId(): string {
      return `basetext-${this.annotatorUuid}-${this.id}`;
    },
    svgId(): string {
      return `svg-${this.annotatorUuid}-${this.id}`;
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
          this.basetextId
        ) as unknown as SVGTextElement;
      });
    },
    color(entity: Entity): string {
      return this.entityLabels.getColor(entity.label)!;
    },
    labelText(entity: Entity): string {
      return this.entityLabels.getText(entity.label)!;
    },
    isSelectedRelation(relation: RelationListItem): boolean {
      return this.selectedRelation === relation;
    },
    isSelectedEntity(entity: Entity): boolean {
      if (this.selectedRelation) {
        return this.selectedRelation.consistOf(entity);
      } else {
        return (
          this.selectedEntities.filter((e) => e.id === entity.id).length > 0
        );
      }
    },
  },
});
</script>

<style scoped>
svg {
  overflow-wrap: normal;
}
</style>
