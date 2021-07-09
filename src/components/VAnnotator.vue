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
import { TextLine } from "@/domain/models/Line/TextLine";
import { TextLineSplitter } from "@/domain/models/Line/TextLineSplitter";
import { Labels, ILabel } from "@/domain/models/Label/Label";
import { Entities, IEntity } from "@/domain/models/Label/Entity";
import { TextLineView } from "@/domain/models/View/TextLineView";
import { EntityLineView } from "@/domain/models/View/EntityLineView";
import { SVGNS } from "@/domain/models/View/SVGNS";
import { EventEmitter } from "events";
import { TextSelectionHandler } from "../domain/models/EventHandler/TextSelectionHandler";
import { TextWidthCalculator } from "../domain/models/Line/Strategy";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";

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
    showLabelText: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  data() {
    return {
      containerElement: {} as HTMLElement | null,
      svgElement: {} as SVGSVGElement,
      textElement: {} as SVGTextElement,
      lines: [] as TextLine[],
      font: {} as Font,
      emitter: new EventEmitter(),
      textSelectionHandler: {} as TextSelectionHandler,
    };
  },

  mounted() {
    this.containerElement = document.getElementById("container");
    this.svgElement = this.$refs.svgContainer as SVGSVGElement;
    this.textElement = this.$refs.textContainer as SVGTextElement;
    window.addEventListener("resize", _.debounce(this.handleResize, 500));
    const labelText = this.entityLabels.map((label) => label.text).join("");
    this.font = createFont(this.text + labelText, this.textElement);
    this.textSelectionHandler = new TextSelectionHandler(this.emitter);
    this.handleResize();
    this.registerEvents();
  },

  watch: {
    entities: {
      handler() {
        this.render();
      },
      deep: true,
    },
    showLabelText() {
      this.render();
    },
  },

  computed: {
    _entities(): Entities {
      return Entities.valueOf(this.entities);
    },
    _entityLabels(): EntityLabels {
      const labels = Labels.valueOf(this.entityLabels);
      return createEntityLabels(3, 5, this.font, labels);
    },
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    registerEvents() {
      this.emitter.on(
        "textSelected",
        (startOffset: number, endOffset: number) => {
          this.$emit("add:entity", startOffset, endOffset);
        }
      );
      this.emitter.on("update:entity", (id: number) => {
        this.$emit("update:entity", id);
      });
      this.emitter.on("remove:entity", (id: number) => {
        this.$emit("remove:entity", id);
      });
      this.emitter.on("click:label", (id: number) => {
        this.$emit("click:entity", id);
      });
    },
    handleResize() {
      const maxWidth = this.containerElement!.clientWidth;
      this.svgElement.setAttribute("width", maxWidth.toString() + "px");
      const calculator = new TextWidthCalculator(this.font, maxWidth);
      const splitter = new TextLineSplitter(this.font, calculator);
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
      return textLine.render(this.text);
    },
    renderEntities(line: TextLine): SVGGElement {
      const entityLine = new EntityLineView(
        this.svgElement,
        this._entities.filterByRange(line.startOffset, line.endOffset),
        this._entityLabels,
        line,
        this.emitter,
        this.showLabelText
      ).render(this.text);
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
