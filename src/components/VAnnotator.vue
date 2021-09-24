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
          :margin="marginLeft"
          :key="index"
          @click:entity="clicked"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
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
import _ from "lodash";
import Vue, { PropType } from "vue";
import VLine from "./VLine.vue";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { RecycleScroller } from "vue-virtual-scroller";
import { Label, EntityLabelList } from "@/domain/models/Label/Label";
import { Entities, Entity } from "@/domain/models/Label/Entity";
import { Font } from "@/domain/models/Line/Font";
import { createFont, widthOf } from "@/domain/models/Line/fontFactory";
import { LineWidthManager } from "../domain/models/Line/WidthManager";
import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { getSelection } from "@/domain/models/EventHandler/TextSelectionHandler";

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
      heights: {} as { [id: string]: number },
      maxWidth: 0,
      baseX: 0,
      marginLeft: 0,
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
        this.heights = {};
        this.$nextTick(() => {
          this.font = createFont(this.text, this.textElement!);
        });
      },
      immediate: true,
    },
  },

  computed: {
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
      return Entities.valueOf(JSON.parse(this.entities as string));
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
        return splitter.split(this.text);
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
      this.$nextTick(() => {
        const containerElement = document.getElementById("container")!;
        this.maxWidth = containerElement.clientWidth;
        this.baseX = !this.rtl
          ? containerElement.getBoundingClientRect().left
          : containerElement.getBoundingClientRect().right;
        this.marginLeft = containerElement.getBoundingClientRect().left;
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
        this.$emit("add:entity", startOffset, endOffset);
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
