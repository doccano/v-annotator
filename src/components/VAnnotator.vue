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
          :relations="
            relationList.filterByRange(
              item.textLine.startOffset,
              item.textLine.endOffset
            )
          "
          :relationLabels="relationLabelList"
          :font="font"
          :rtl="rtl"
          :text="text"
          :textLine="item.textLine"
          :base-x="baseX"
          :left="left"
          :right="right"
          :key="index"
          @click:entity="clicked"
          @click:relation="$emit('click:relation', $event)"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
          @contextmenu:relation="$emit('contextmenu:relation', $event)"
          @update:height="updateHeight"
        />
      </template>
    </RecycleScroller>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <text id="text" style="white-space: pre" />
    </svg>
  </div>
</template>

<script lang="ts">
import { debounce } from "lodash-es";
import Vue, { PropType } from "vue";
import VLine from "./VLine.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import { Text } from "@/domain/models/Label/Text";
import {
  Label,
  EntityLabelList,
  RelationLabelList,
} from "@/domain/models/Label/Label";
import { Entities, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { widthOf } from "@/domain/models/Line/Utils";
import { LineWidthManager } from "../domain/models/Line/WidthManager";
import { TextLine } from "@/domain/models/Line/LineText";
import { TextLineSplitter } from "@/domain/models/Line/LineSplitter";
import { getSelection } from "@/domain/models/EventHandler/TextSelectionHandler";
import { Relation, RelationList } from "@/domain/models/Label/Relation";

interface ViewLine {
  id: string;
  textLine: TextLine;
  size: number;
}

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
    relations: {
      type: Array as PropType<Relation[]>,
      default: () => [],
    },
    relationLabels: {
      type: Array as PropType<Label[]>,
      default: () => [],
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
    perCodePoint: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      font: null as Font | null,
      heights: {} as { [id: string]: number },
      maxWidth: 0,
      baseX: 0,
      left: 0,
      right: 0,
      textElement: null as SVGTextElement | null,
    };
  },

  mounted() {
    this.textElement = document.getElementById(
      "text"
    ) as unknown as SVGTextElement;
    window.addEventListener("resize", debounce(this.setMaxWidth, 500));
    this.setMaxWidth();
  },

  watch: {
    text: {
      handler() {
        this.heights = {};
        this.$nextTick(() => {
          this.font = Font.create(this.text, this.textElement!);
        });
      },
      immediate: true,
    },
  },

  computed: {
    _text(): Text {
      return new Text(this.text);
    },
    entityLabelList(): EntityLabelList | null {
      if (this.textElement) {
        const widths = this.entityLabels.map((label) =>
          widthOf(label.text, this.textElement!)
        );
        return EntityLabelList.valueOf(this.entityLabels, widths);
      } else {
        return null;
      }
    },
    relationLabelList(): RelationLabelList | null {
      if (this.textElement) {
        const widths = this.relationLabels.map((label) =>
          widthOf(label.text, this.textElement!)
        );
        return RelationLabelList.valueOf(this.relationLabels, widths);
      } else {
        return null;
      }
    },
    items(): ViewLine[] {
      if (!this.textLines) {
        return [];
      }
      const viewLines: ViewLine[] = [];
      for (let i = 0; i < this.textLines.length; i++) {
        const id = `${this.textLines[i].startOffset}:${this.textLines[i].endOffset}`;
        viewLines.push({
          id,
          textLine: this.textLines[i],
          size: this.heights[id] || 64,
        });
      }
      return viewLines;
    },
    entityList(): Entities {
      if (this.perCodePoint) {
        return Entities.valueOf(JSON.parse(this.entities as string));
      } else {
        return Entities.valueOf(
          JSON.parse(this.entities as string),
          this._text
        );
      }
    },
    relationList(): RelationList {
      return new RelationList(this.relations, this.entityList);
    },
    textLines(): TextLine[] {
      if (!this.font || !this.entityLabelList) {
        return [];
      } else {
        const maxLabelWidth = this.entityLabelList.maxLabelWidth();
        const calculator = new LineWidthManager(
          this.font,
          this.maxWidth,
          maxLabelWidth
        );
        const splitter = new TextLineSplitter(calculator);
        return splitter.split(this._text);
      }
    },
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.setMaxWidth);
  },

  methods: {
    clicked(entity: Entity) {
      this.$emit("click:entity", entity.id);
    },
    setMaxWidth() {
      this.$nextTick(() => {
        const containerElement = document.getElementById("container")!;
        this.maxWidth = containerElement.clientWidth;
        const rect = containerElement.getBoundingClientRect();
        this.baseX = !this.rtl ? rect.left : rect.right;
        this.left = rect.left;
        this.right = rect.right;
      });
    },
    updateHeight(id: string, height: number) {
      this.$set(this.heights, id, height);
    },
    open(): void {
      try {
        const [startOffset, endOffset] = getSelection();
        if (startOffset >= endOffset) {
          return;
        }
        if (!this.allowOverlapping) {
          const entities = this.entityList.filterByRange(
            startOffset,
            endOffset
          );
          if (entities.length > 0) {
            return;
          }
        }
        if (this.perCodePoint) {
          this.$emit("add:entity", startOffset, endOffset);
        } else {
          const graphemeStartOffset = this._text.toGraphemeOffset(startOffset);
          const graphemeEndOffset = this._text.toGraphemeOffset(endOffset);
          this.$emit("add:entity", graphemeStartOffset, graphemeEndOffset);
        }
      } catch (e) {
        return;
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
.scroller >>> .vue-recycle-scroller__item-wrapper {
  height: 100vh;
}
</style>
