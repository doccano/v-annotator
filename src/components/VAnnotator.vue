<template>
  <div id="container" @click="open">
    <DynamicScroller
      page-mode
      :items="lines"
      :min-item-size="54"
      class="scroller"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <v-line
            :entities="item.entities"
            :entityLabels="_entityLabels"
            :font="font"
            :showLabelText="showLabelText"
            :text="text"
            :textLine="item.textLine"
            :key="index"
            @click:entity="clicked"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import VLine from "./VLine.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import { Labels, Label } from "@/domain/models/Label/Label";
import { Entities, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextWidthCalculator } from "../domain/models/Line/Strategy";
import { TextLine, Span } from "@/domain/models/Line/TextLine";
import { createTextLineSplitter } from "../domain/models/Line/TextLineSplitterFactory";
import { TextLines } from "@/domain/models/Line/Observer";
import { BaseLineSplitter } from "@/domain/models/Line/TextLineSplitter";

interface GeometricLine {
  id: string;
  entities: Entity[];
  textLine: TextLine;
}

const textLines = new TextLines("", {} as BaseLineSplitter);
const entityList = new Entities([]);
entityList.register(textLines);

export default Vue.extend({
  components: {
    DynamicScroller,
    DynamicScrollerItem,
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
    showLabelText: {
      type: Boolean,
      default: false,
      required: true,
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
      const splitter = createTextLineSplitter(
        this.showLabelText,
        calculator,
        this._entityLabels!
      );
      const geometricLines: GeometricLine[] = [];
      textLines.updateSplitter(splitter);
      entityList.update(this.entities);
      for (const line of textLines.list()) {
        geometricLines.push({
          id: `${line.startOffset}:${line.endOffset}`,
          textLine: line,
          entities: this._entities.filterByRange(
            line.startOffset,
            line.endOffset
          ),
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
