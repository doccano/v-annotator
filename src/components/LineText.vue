<template>
  <tspan x="0">
    <v-span
      v-for="(span, index) in spans"
      :key="index"
      :span="span"
      :text="text"
    />
  </tspan>
</template>

<script lang="ts">
import { Span } from "@/domain/models/Line/TextLine";
import Vue, { PropType } from "vue";
import VSpan from "./VSpan.vue";

export default Vue.extend({
  components: {
    VSpan,
  },

  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    spans: {
      type: [] as PropType<Span[]>,
      default: [],
      required: true,
    },
  },
});
</script>
