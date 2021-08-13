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
import { Labels, ILabel } from "@/domain/models/Label/Label";
import { Entities, IEntity, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { TextWidthCalculator } from "../domain/models/Line/Strategy";
import { TextLine, Span } from "@/domain/models/Line/TextLine";
import { createTextLineSplitter } from "../domain/models/Line/TextLineSplitterFactory";

interface GeometricLine {
  id: string;
  entities: Entity[];
  textLine: TextLine;
}

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
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const entities = this._entities.filterByRange(
          line.startOffset,
          line.endOffset
        );
        const id = `${line.startOffset};${line.endOffset}`;
        geometricLines.push({ id, textLine: line, entities });
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
      window.getSelection()?.removeAllRanges();
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
