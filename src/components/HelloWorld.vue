<template>
  <div id="container" />
</template>

<script lang="ts">
import Vue from "vue";
import { SVGNS } from "@/domain/models/Character/SVGNS";
import { LineSplitter } from "@/domain/models/Line/LineSplitter";
import { calcWidth } from "@/domain/models/Character/Character";

export default Vue.extend({
  mounted() {
    const containerElement = document.getElementById("container")!;
    const svgElement = document.createElementNS(SVGNS, "svg");
    svgElement.setAttribute("xmlns", SVGNS);
    containerElement.appendChild(svgElement);
    const textElement = document.createElementNS(SVGNS, "text");
    svgElement.appendChild(textElement);
    const text =
      "We must respect the will of the individual.\nTake it easy, I can assure you that everything will turn out to be fine.";

    const maxWidth = containerElement.clientWidth;
    svgElement.setAttribute("width", maxWidth.toString() + "px");
    const vocab = calcWidth(text, textElement);
    const splitter = new LineSplitter(vocab, maxWidth);
    const lines = splitter.split(text);
    let y = 24;
    for (const line of lines) {
      const tspanElement = document.createElementNS(SVGNS, "tspan");
      tspanElement.textContent = line.content;
      tspanElement.setAttribute("x", "0px");
      tspanElement.setAttribute("dy", y.toString() + "px");
      textElement.append(tspanElement);
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  background-color: #888;
  width: 500px;
}

svg {
  min-width: 500px;
}
</style>
