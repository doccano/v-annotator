<template>
  <div id="container" @click="open">
    <RecycleScroller page-mode class="scroller" :items="items">
      <template v-slot="{ item, index }">
        <v-line
          :entities="
            _entities.filterByRange(
              item.textLine.startOffset,
              item.textLine.endOffset
            )
          "
          :entityLabels="entityLabels_"
          :font="font"
          :rtl="rtl"
          :text="text"
          :textLine="item.textLine"
          :x="x"
          :key="index"
          @click:entity="clicked"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
        />
      </template>
    </RecycleScroller>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <text><tspan id="textWidth" /></text>
    </svg>
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
import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLines } from "@/domain/models/Line/Observer";
import {
  BaseLineSplitter,
  TextLineSplitter,
} from "@/domain/models/Line/TextLineSplitter";

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
      type: String,
      default: () => [],
      required: true,
    },
    entityLabels: {
      type: Array as PropType<Label[]>,
      default: () => [],
      required: true,
    },
    allowOverlapping: {
      type: Boolean,
      default: false,
      required: false,
    },
    rtl: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      font: null as Font | null,
      maxWidth: 0,
      entityLabels_: null as EntityLabels | null,
      x: 0,
    };
  },

  mounted() {
    this.$nextTick(() => {
      const tspanElement = document.getElementById(
        "textWidth"
      )! as unknown as SVGTSpanElement;
      const labels = Labels.valueOf(this.entityLabels);
      this.entityLabels_ = createEntityLabels(tspanElement, labels);
    });
    window.addEventListener("resize", _.debounce(this.setMaxWidth, 500));
    this.setMaxWidth();
  },

  watch: {
    text: {
      handler() {
        textLines.updateText(this.text);
        this.$nextTick(() => {
          const containerElement = document.getElementById("container")!;
          this.font = createFont(this.text, containerElement);
        });
      },
      immediate: true,
    },
  },

  computed: {
    items(): GeometricLine[] {
      if (!this.font || !this.entityLabels_) {
        return [];
      }
      const calculator = new TextWidthCalculator(this.font, this.maxWidth);
      const splitter = new TextLineSplitter(calculator, this.entityLabels_);
      const geometricLines: GeometricLine[] = [];
      textLines.updateSplitter(splitter);
      entityList.update(this._entities.list());
      const lines = textLines.list();
      for (let i = 0; i < lines.length; i++) {
        geometricLines.push({
          id: `${lines[i].startOffset}:${lines[i].endOffset}:${lines[i].level}`,
          textLine: lines[i],
          size: this.getHeight(lines[i]),
        });
      }
      console.log(geometricLines)
      return geometricLines;
    },
    _entities(): Entities {
      return Entities.valueOf(JSON.parse(this.entities as string));
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
      this.$nextTick(() => {
        const containerElement = document.getElementById("container")!;
        this.maxWidth = containerElement.clientWidth;
        this.x = !this.rtl
          ? 0
          : containerElement.getBoundingClientRect().right - 8; // 8 is margin
      });
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
          startElement as unknown as { annotatorElement: TextLine }
        ).annotatorElement;
        const endLine = (
          endElement as unknown as { annotatorElement: TextLine }
        ).annotatorElement;
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
