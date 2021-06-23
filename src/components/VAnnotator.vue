<template>
  <div id="container">
    <svg xmlns="http://www.w3.org/2000/svg" ref="svgContainer">
      <text ref="textContainer">
        <line-view
          v-for="(item, key) in lines"
          :key="key"
          :text="item.content"
          :x="x"
          :dy="dy"
        />
      </text>
    </svg>
    {{ containerElement.clientWidth }}
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import Vue from "vue";
import { calcWidth } from "@/domain/models/Character/Character";
import { Line } from "@/domain/models/Line/Line";
import { LineSplitter } from "@/domain/models/Line/LineSplitter";
import LineView from "./LineView.vue";

export default Vue.extend({
  components: {
    LineView,
  },

  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    entities: {
      type: Array,
      default: () => [],
      required: true,
    },
    relations: {
      type: Array,
      default: () => [],
      required: false,
    },
    entityLabels: {
      type: Array,
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
      lines: [] as Line[],
      vocab: {} as Map<string, number>,
      x: 0,
      dy: 24,
    };
  },

  mounted() {
    this.containerElement = document.getElementById("container");
    this.svgElement = this.$refs.svgContainer as SVGSVGElement;
    this.textElement = this.$refs.textContainer as SVGTextElement;
    window.addEventListener("resize", _.debounce(this.handleResize, 500));
    this.vocab = calcWidth(this.text, this.textElement);
    this.handleResize();
  },

  beforeDestroy: function () {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    addEntity() {
      this.$emit("add:entity");
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
      const splitter = new LineSplitter(this.vocab, maxWidth);
      this.lines = splitter.split(this.text);
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
  background-color: rgb(124, 120, 120);
}
</style>
