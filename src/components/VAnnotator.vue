<template>
  <div id="container" @click="open">
    <RecycleScroller page-mode class="scroller" :items="items">
      <template v-slot="{ item, index }">
        <v-line
          :entities="
            entityList.filterByRange(
              item.textLine.startOffset,
              item.textLine.endOffset
            )
          "
          :entityLabels="entityLabelList"
          :font="font"
          :rtl="rtl"
          :text="text"
          :textLine="item.textLine"
          :base-x="baseX"
          :key="index"
          @click:entity="clicked"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
        />
      </template>
    </RecycleScroller>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <text id="text" />
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
import { LineWidthManager } from "../domain/models/Line/WidthManager";
import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLines } from "@/domain/models/Line/Observer";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";

interface ViewLine {
  id: string;
  textLine: TextLine;
  size: number;
}

const textLines = new TextLines("");
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
      baseX: 0,
      textElement: null as SVGTextElement | null,
    };
  },

  mounted() {
    this.textElement = document.getElementById(
      "text"
    ) as unknown as SVGTextElement;
    window.addEventListener("resize", _.debounce(this.setMaxWidth, 500));
    this.setMaxWidth();
  },

  watch: {
    text: {
      handler() {
        textLines.updateText(this.text);
        this.$nextTick(() => {
          this.font = createFont(this.text, this.textElement!);
        });
      },
      immediate: true,
    },
    maxWidth() {
      textLines.reset();
    },
  },

  computed: {
    entityLabelList(): EntityLabels | null {
      if (this.textElement) {
        const labels = Labels.valueOf(this.entityLabels);
        return createEntityLabels(this.textElement, labels);
      } else {
        return null;
      }
    },
    items(): ViewLine[] {
      if (!this.font || !this.entityLabelList) {
        return [];
      }
      const calculator = new LineWidthManager(this.font, this.maxWidth);
      const splitter = new TextLineSplitter(calculator, this.entityLabelList);
      const viewLines: ViewLine[] = [];
      textLines.updateSplitter(splitter);
      entityList.update(this.entityList.list());
      const lines = textLines.list();
      for (let i = 0; i < lines.length; i++) {
        viewLines.push({
          id: `${lines[i].startOffset}:${lines[i].endOffset}:${lines[i].level}`,
          textLine: lines[i],
          size: this.getHeight(lines[i]),
        });
      }
      return viewLines;
    },
    entityList(): Entities {
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
        this.baseX = !this.rtl
          ? containerElement.getBoundingClientRect().left
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
      if (!this.allowOverlapping) {
        const entities = this.entityList.filterByRange(startOffset, endOffset);
        if (entities.length > 0) {
          return;
        }
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
