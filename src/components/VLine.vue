<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style="width: 100%"
    ref="svg"
    :style="{ height: height + 'px' }"
  >
    <g :transform="translate">
      <text>
        <line-text :spans="textLine.spans" :text="text" />
      </text>
      <line-entity
        :entities="entities"
        :entityLabels="entityLabels"
        :font="font"
        :showLabelText="showLabelText"
        :text="text"
        :textLine="textLine"
        @click:entity="$emit('click:entity', $event)"
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

  data() {
    return {
      height: 0,
    };
  },

  watch: {
    showLabelText() {
      this.$nextTick().then(() => this.setHeight());
    },
  },

  mounted() {
    this.setHeight();
  },

  computed: {
    translate(): string {
      return `translate(0, ${this.font.lineHeight})`;
    },
  },

  methods: {
    setHeight(): void {
      const svgElement = this.$refs.svg as SVGSVGElement;
      this.height = svgElement.getBBox().height + this.font.lineHeight;
    },
  },
});
</script>

<style scoped>
svg {
  white-space: pre;
  overflow-wrap: normal;
}
</style>