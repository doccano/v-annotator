<template>
  <div id="container" @click="open">
    <RecycleScroller page-mode class="scroller" :items="lines">
      <template v-slot="{ item, index }">
        <v-line
          :entities="
            _entities.filterByRange(
              item.textLine.startOffset,
              item.textLine.endOffset
            )
          "
          :entityLabels="_entityLabels"
          :font="font"
          :text="text"
          :textLine="item.textLine"
          :key="index"
          :style="{ height: item.size + 'px' }"
          @click:entity="clicked"
        />
      </template>
    </RecycleScroller>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import VLine from "./VLine.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import { Labels, Label } from "@/domain/models/Label/Label";
import { Entities, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextWidthCalculator } from "../domain/models/Line/Strategy";
import { TextLine, Span } from "@/domain/models/Line/TextLine";
import { TextLines } from "@/domain/models/Line/Observer";
import { BaseLineSplitter, TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";

interface GeometricLine {
  id: string;
  textLine: TextLine;
  size: number;
}

const textLines = new TextLines("", {} as BaseLineSplitter);
const entityList = new Entities([]);
entityList.register(textLines);

export default Vue.extend({
  components: {
    RecycleScroller,
    VLine,
  },

  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    entities: {
      type: Array as PropType<Entity[]>,
      default: () => [],
      required: true,
    },
    relations: {
      type: Array,
      default: () => [],
      required: false,
    },
    entityLabels: {
      type: Array as PropType<Label[]>,
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
  },

  data() {
    return {
      font: null as Font | null,
      maxWidth: 0,
      containerElement: {} as HTMLElement,
    };
  },

  mounted() {
    this.containerElement = document.getElementById("container")!;
    const labelText = this.entityLabels.map((label) => label.text).join("");
    this.font = createFont(this.text + labelText, this.containerElement);
    window.addEventListener("resize", _.debounce(this.setMaxWidth, 500));
    this.setMaxWidth();
  },

  watch: {
    text: {
      handler() {
        textLines.updateText(this.text);
      },
      immediate: true,
    },
  },

  computed: {
    lines(): GeometricLine[] {
      if (!this.font || !this._entityLabels) {
        return [];
      }
      const calculator = new TextWidthCalculator(this.font, this.maxWidth);
      const splitter = new TextLineSplitter(calculator, this._entityLabels);
      const geometricLines: GeometricLine[] = [];
      textLines.updateSplitter(splitter);
      entityList.update(this.entities);
      const lines = textLines.list();
      for (let i = 0; i < lines.length; i++) {
        geometricLines.push({
          id: `${lines[i].startOffset}:${lines[i].endOffset}:${lines[i].level}`,
          textLine: lines[i],
          size: this.getHeight(lines[i]),
        });
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
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.setMaxWidth);
  },

  methods: {
    clicked(entity: Entity) {
      console.log(entity);
    },
    getHeight(line: TextLine): number {
      const marginBottom = 8;
      const lineWidth = 5;
      return (
        44 +
        (lineWidth + this.font!.lineHeight) * line.level +
        Math.max(marginBottom * (line.level - 1), 0)
      );
    },
    setMaxWidth() {
      this.maxWidth = this.containerElement.clientWidth;
      // svgElement.width.baseVal.value;
    },
    open(): void {
      const selection = window.getSelection();
      let startElement = null;
      let endElement = null;
      try {
        startElement = selection!.anchorNode!.parentNode;
        endElement = selection!.focusNode!.parentNode;
      } catch (e) {
        return;
      }
      let startOffset: number;
      let endOffset: number;
      try {
        const startLine = (
          startElement as unknown as { annotatorElement: Span }
        ).annotatorElement;
        const endLine = (endElement as unknown as { annotatorElement: Span })
          .annotatorElement;
        startOffset = startLine.startOffset + selection!.anchorOffset;
        endOffset = endLine.startOffset + selection!.focusOffset;
      } catch (e) {
        return;
      }
      if (startOffset > endOffset) {
        [startOffset, endOffset] = [endOffset, startOffset];
      }
      if (startOffset >= endOffset) {
        return;
      }
      this.$emit("add:entity", startOffset, endOffset);
      selection?.removeAllRanges();
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
