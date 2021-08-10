<template>
  <div id="container">
    <v-line
      :entities="line.entities"
      :entityLabels="_entityLabels"
      :font="font"
      :showLabelText="showLabelText"
      :text="text"
      :textLine="line.textLine"
      v-for="(line, index) in lines"
      :key="index"
    />
    <svg xmlns="http://www.w3.org/2000/svg" ref="svgContainer">
      <text ref="textContainer" />
    </svg>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import VLine from "./VLine.vue";
import { Labels, ILabel } from "@/domain/models/Label/Label";
import { Entities, IEntity, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextWidthCalculator } from "../domain/models/Line/Strategy";
import { TextLine } from "@/domain/models/Line/TextLine";
import { createTextLineSplitter } from "../domain/models/Line/TextLineSplitterFactory";

interface GeometricLine {
  entities: Entity[];
  textLine: TextLine;
}

export default Vue.extend({
  components: {
    VLine,
  },

  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    entities: {
      type: Array as PropType<IEntity[]>,
      default: () => [],
      required: true,
    },
    relations: {
      type: Array,
      default: () => [],
      required: false,
    },
    entityLabels: {
      type: Array as PropType<ILabel[]>,
      default: () => [],
      required: true,
    },
    relationLabels: {
      type: Array,
      default: () => [],
      required: false,
    },
    allowOverlapping: {
      type: Boolean,
      default: false,
      required: false,
    },
    allowMultipleRelation: {
      type: Boolean,
      default: false,
      required: false,
    },
    showLabelText: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      font: null as Font | null,
      containerElement: {} as HTMLElement,
    };
  },

  mounted() {
    this.containerElement = document.getElementById("container")!;
    const textElement = this.$refs.textContainer as SVGTextElement;
    const labelText = this.entityLabels.map((label) => label.text).join("");
    this.font = createFont(this.text + labelText, textElement);
  },

  computed: {
    lines(): GeometricLine[] {
      if (!this.font || !this._entityLabels) {
        return [];
      }
      const calculator = new TextWidthCalculator(this.font, this.maxWidth);
      const splitter = createTextLineSplitter(
        this.showLabelText,
        calculator,
        this._entities,
        this._entityLabels!
      );
      const geometricLines: GeometricLine[] = [];
      const lines = splitter.split(this.text);
      for (const line of lines) {
        const entities = this._entities
          .filterByRange(line.startOffset, line.endOffset)
          .list();
        geometricLines.push({ textLine: line, entities });
      }
      return geometricLines;
    },
    _entities(): Entities {
      return Entities.valueOf(this.entities);
    },
    _entityLabels(): EntityLabels | null {
      if (this.font) {
        const labels = Labels.valueOf(this.entityLabels);
        return createEntityLabels(3, 5, this.font, labels);
      } else {
        return null;
      }
    },
    maxWidth(): number {
      if (this.containerElement) {
        return this.containerElement.clientWidth;
      } else {
        return 0;
      }
    },
  },
});
</script>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
</style>
