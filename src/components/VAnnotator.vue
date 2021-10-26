<template>
  <div id="container" @click="open" @touchend="open">
    <RecycleScroller page-mode class="scroller" :items="items">
      <template v-slot="{ item, index }">
        <v-line
          :dark="dark"
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
          :selected-entity="selectedEntity"
          :selected-relation="selectedRelation"
          :text="text"
          :textLine="item.textLine"
          :base-x="baseX"
          :left="left"
          :right="right"
          :key="`${index}:${rtl}`"
          @click:entity="clicked"
          @click:relation="$emit('click:relation', $event)"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
          @contextmenu:relation="$emit('contextmenu:relation', $event)"
          @update:height="updateHeight"
          @setSelectedEntity="selectedEntity = $event"
          @setSelectedRelation="selectedRelation = $event"
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
  LabelList,
  EntityLabelListItem,
  RelationLabelListItem,
} from "@/domain/models/Label/Label";
import { Entities, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { widthOf } from "@/domain/models/Line/Utils";
import { LineWidthManager } from "../domain/models/Line/WidthManager";
import { TextLine } from "@/domain/models/Line/LineText";
import { TextLineSplitter } from "@/domain/models/Line/LineSplitter";
import { TextSelector } from "@/domain/models/EventHandler/TextSelectionHandler";
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
      type: Array as PropType<Entity[]>,
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
    graphemeMode: {
      type: Boolean,
      default: true,
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      font: null as Font | null,
      heights: {} as { [id: string]: number },
      maxWidth: -1,
      baseX: 0,
      left: 0,
      right: 0,
      textElement: null as SVGTextElement | null,
      selectedRelation: null as Relation | null,
      selectedEntity: null as Entity | null,
    };
  },

  mounted() {
    this.textElement = document.getElementById(
      "text"
    ) as unknown as SVGTextElement;
    window.addEventListener("resize", this.setMaxWidth);
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
    rtl() {
      this.setMaxWidth();
    },
  },

  computed: {
    _text(): Text {
      return new Text(this.text);
    },
    entityLabelList(): LabelList | null {
      if (this.textElement) {
        const widths = this.entityLabels.map((label) =>
          widthOf(label.text, this.textElement!)
        );
        return LabelList.valueOf(
          this.entityLabels,
          widths,
          EntityLabelListItem
        );
      } else {
        return null;
      }
    },
    relationLabelList(): LabelList | null {
      if (this.textElement) {
        const widths = this.relationLabels.map((label) =>
          widthOf(label.text, this.textElement!)
        );
        return LabelList.valueOf(
          this.relationLabels,
          widths,
          RelationLabelListItem
        );
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
      this.resetSelection();
      if (this.graphemeMode) {
        return Entities.valueOf(this.entities, this._text);
      } else {
        return Entities.valueOf(this.entities);
      }
    },
    relationList(): RelationList {
      this.resetSelection();
      return new RelationList(this.relations, this.entityList);
    },
    textLines(): TextLine[] {
      if (!this.font || !this.entityLabelList || this.maxWidth === -1) {
        return [];
      } else {
        const maxLabelWidth = this.entityLabelList.maxLabelWidth;
        const calculator = new LineWidthManager(this.maxWidth, maxLabelWidth);
        const splitter = new TextLineSplitter(calculator, this.font);
        return splitter.split(this._text);
      }
    },
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.setMaxWidth);
  },

  methods: {
    clicked(event: Event, entity: Entity) {
      this.$emit("click:entity", event, entity.id);
    },
    setMaxWidth() {
      this.$nextTick(
        debounce(() => {
          const containerElement = document.getElementById("container")!;
          this.maxWidth = containerElement.clientWidth;
          const rect = containerElement.getBoundingClientRect();
          this.left = rect.left;
          this.right = rect.right - rect.left;
          this.baseX = !this.rtl ? 0 : this.right;
        }, 500)
      );
    },
    updateHeight(id: string, height: number) {
      this.$set(this.heights, id, height);
    },
    resetSelection() {
      this.selectedRelation = null;
      this.selectedEntity = null;
    },
    open(event: Event): void {
      try {
        const selector = new TextSelector(
          this.allowOverlapping,
          this.graphemeMode
        );
        const [startOffset, endOffset] = selector.getOffsets(
          this.entityList,
          this._text
        );
        this.$emit("add:entity", event, startOffset, endOffset);
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
