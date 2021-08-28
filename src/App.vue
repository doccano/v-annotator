<template>
  <div id="app">
    <v-annotator
      :text="text"
      :entities="entities"
      :entity-labels="entityLabels"
      @add:entity="addEntity"
      @click:entity="updateEntity"
      @contextmenu:entity="deleteEntity"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VAnnotator from "./components/VAnnotator.vue";
import { Entity } from "./domain/models/Label/Entity";

export default Vue.extend({
  name: "App",

  components: {
    VAnnotator,
  },

  data() {
    return {
      id: 5,
      text: "we must respect the will of the individual.\nTake it easy I can assure you that everything will turn out to be fine.\n".repeat(
        10000
      ),
      entities: [
        {
          id: 0,
          user: 0,
          label: 0,
          startOffset: 3,
          endOffset: 7,
        },
        {
          id: 4,
          user: 0,
          label: 0,
          startOffset: 35,
          endOffset: 46,
        },
        {
          id: 1,
          user: 0,
          label: 1,
          startOffset: 59,
          endOffset: 62,
        },
        {
          id: 2,
          user: 0,
          label: 0,
          startOffset: 79,
          endOffset: 89,
        },
        {
          id: 3,
          user: 0,
          label: 1,
          startOffset: 79,
          endOffset: 94,
        },
      ],
      entityLabels: [
        {
          id: 0,
          text: "Lorem",
          color: "#2196F3",
        },
        {
          id: 1,
          text: "Ipsum",
          color: "#F9A825",
        },
      ],
    };
  },

  created() {
    for (let i = 0; i < 10000; i++) {
      this.addEntity(i * 10 + 100, i * 10 + 105);
    }
  },

  methods: {
    addEntity(startOffset: number, endOffset: number) {
      this.entities.push({
        id: this.id,
        startOffset,
        endOffset,
        label: 0,
        user: 0,
      });
      this.id++;
    },
    updateEntity(id: number) {
      console.log(id);
    },
    deleteEntity(entity: Entity) {
      this.entities = this.entities.filter((e) => e.id !== entity.id);
    },
  },
});
</script>
