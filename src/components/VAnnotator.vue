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
});
</script>
