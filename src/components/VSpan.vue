<template>
  <tspan
    :dx="span.dx"
    v-text="text.substring(span.startOffset, span.endOffset)"
  />
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Span } from "@/domain/models/Line/TextLine";

export default Vue.extend({
  props: {
    span: {
      type: Object as PropType<Span>,
      required: true,
    },
    text: {
      type: String,
      default: "",
      required: true,
    },
  },

  watch: {
    span: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          (this.$el as unknown as { annotatorElement: Span }).annotatorElement =
            this.span;
        });
      },
    },
  },
});
</script>
