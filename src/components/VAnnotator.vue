<template>
  <div id="container"></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
  },
});
</script>
