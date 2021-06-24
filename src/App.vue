<template>
  <div id="app">
    <v-annotator
      :text="text"
      :entities="entities"
      :entity-labels="entityLabels"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VAnnotator from "./components/VAnnotator.vue";

export default Vue.extend({
  name: "App",

  components: {
    VAnnotator,
  },

  data() {
    return {
      text: "we must respect the will of the individual. Take it easy I can assure you that everything will turn out to be fine.",
      entities: [
        {
          id: 0,
          user: 0,
          label: 0,
          startOffset: 3,
          endOffset: 7,
        },
      ],
      entityLabels: [
        {
          id: 0,
          text: "Test",
          color: "#777",
        },
      ],
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
