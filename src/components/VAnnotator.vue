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
import { Labels, ILabel } from "@/domain/models/Label/Label";
import { Entities, IEntity } from "@/domain/models/Label/Entity";
import { EventEmitter } from "events";
import { Font } from "@/domain/models/Line/Font";
import { createFont } from "@/domain/models/View/fontFactory";
import { createEntityLabels } from "../domain/models/Line/ShapeFactory";
import { EntityLabels } from "@/domain/models/Line/Shape";
import { Annotator } from "../domain/models/View/Annotator";

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
      font: {} as Font,
      emitter: new EventEmitter(),
      annotator: {} as Annotator,
    };
  },

  mounted() {
    const containerElement = document.getElementById("container");
    const svgElement = this.$refs.svgContainer as SVGSVGElement;
    const textElement = this.$refs.textContainer as SVGTextElement;
    this.annotator = new Annotator(
      containerElement!,
      svgElement,
      textElement,
      this.showLabelText,
      this.emitter
    );
    window.addEventListener("resize", _.debounce(this.handleResize, 500));
    const labelText = this.entityLabels.map((label) => label.text).join("");
    this.font = createFont(this.text + labelText, textElement);
    this.handleResize();
    this.registerEvents();
  },

  watch: {
    entities: {
      handler() {
        if (this.showLabelText) {
          this.handleResize();
        } else {
          this.render();
        }
      },
      deep: true,
    },
    showLabelText() {
      this.annotator.onChangeLabelOption(this.showLabelText);
      this.handleResize();
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
      this.annotator.onResize();
      this.render();
    },
    render() {
      this.annotator.render(
        this.text,
        this.font,
        this._entities,
        this._entityLabels
      );
    },
  },
});
</script>

<style scoped>
svg {
  white-space: pre;
  overflow-wrap: normal;
}
#container {
  width: 100%;
  height: 100vh;
}
</style>
