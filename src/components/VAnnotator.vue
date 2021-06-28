<template>
  <div id="container">
    <svg xmlns="http://www.w3.org/2000/svg" ref="svgContainer">
      <text ref="textContainer" />
    </svg>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { calcWidth } from "@/domain/models/Character/Character";
import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { Labels, ILabel } from "@/domain/models/Label/Label";
import { Entities, IEntity } from "@/domain/models/Label/Entity";
import { TextLineView } from "@/domain/models/View/TextLineView";
import { EntityLineView } from "@/domain/models/View/EntityLineView";
import { SVGNS } from "@/domain/models/Character/SVGNS";
import { EventEmitter } from "events";
import { TextSelectionHandler } from "../domain/models/EventHandler/TextSelectionHandler";

export default Vue.extend({
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
  },

  data() {
    return {
      containerElement: {} as HTMLElement | null,
      svgElement: {} as SVGSVGElement,
      textElement: {} as SVGTextElement,
      lines: [] as TextLine[],
      vocab: {} as Map<string, number>,
      x: 0,
      dy: 24,
      emitter: new EventEmitter(),
      textSelectionHandler: {} as TextSelectionHandler,
    };
  },

  mounted() {
    this.containerElement = document.getElementById("container");
    this.svgElement = this.$refs.svgContainer as SVGSVGElement;
    this.textElement = this.$refs.textContainer as SVGTextElement;
    window.addEventListener("resize", _.debounce(this.handleResize, 500));
    this.vocab = calcWidth(this.text, this.textElement);
    this.textSelectionHandler = new TextSelectionHandler(this.emitter);
    this.handleResize();
    this.emitter.on("textSelected", (startIndex: number, endIndex: number) => {
      console.log(startIndex, endIndex);
      this.addEntity(startIndex, endIndex);
    });
  },

  watch: {
    entities: {
      handler() {
        this.render();
      },
      deep: true,
    },
  },

  computed: {
    _entities(): Entities {
      console.log(Entities.valueOf(this.entities))
      return Entities.valueOf(this.entities);
    },
    _entityLabels(): Labels {
      return Labels.valueOf(this.entityLabels);
    },
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    addEntity(startOffset: number, endOffset: number) {
      this.$emit("add:entity", startOffset, endOffset);
    },
    addRelation() {
      this.$emit("add:relation");
    },
    updateEntity() {
      this.$emit("update:entity");
    },
    updateRelation() {
      this.$emit("update:relation");
    },
    removeEntity() {
      this.$emit("remove:entity");
    },
    removeRelation() {
      this.$emit("remove:relation");
    },
    handleResize() {
      const maxWidth = this.containerElement!.clientWidth;
      this.svgElement.setAttribute("width", maxWidth.toString() + "px");
      const splitter = new TextLineSplitter(this.vocab, maxWidth);
      this.lines = splitter.split(this.text);
      this.render();
    },
    render() {
      let height = 0;
      const marginBottom = 12;
      while (this.svgElement.lastChild) {
        this.svgElement.removeChild(this.svgElement.lastChild);
      }
      this.textElement = document.createElementNS(SVGNS, "text");
      this.textElement.onmouseup = () => {
        if (window.getSelection()!.type === "Range") {
          this.textSelectionHandler.textSelected();
        }
      };
      this.svgElement.appendChild(this.textElement);
      for (const line of this.lines) {
        const textLine = this.renderText(line);
        const entityLine = this.renderEntities(line);
        height += textLine.getBBox().height;
        entityLine.setAttribute(
          "transform",
          `translate(0 ${height.toString()})`
        );
        textLine.setAttribute("x", "0");
        textLine.setAttribute("y", height.toString());
        height += Math.max(
          entityLine.getBBox().height,
          textLine.getBBox().height
        );
        height += marginBottom;
      }
    },
    renderText(line: TextLine): SVGTSpanElement {
      const textLine = new TextLineView(line, this.textElement);
      return textLine.render();
    },
    renderEntities(line: TextLine): SVGGElement {
      const entityLine = new EntityLineView(
        this.svgElement,
        this._entities.filterByRange(line.startOffset, line.endOffset),
        this._entityLabels,
        line
      ).render();
      return entityLine;
    },
  },
});
</script>

<style scoped>
svg {
  white-space: pre;
  overflow-wrap: normal;
  height: 100%;
}
#container {
  width: 100%;
  height: 100vh;
}
</style>
