<template>
  <tspan v-if="snippet" :x="span.x" v-text="snippet" />
  <tspan v-else x="0" style="font-size: 6px">⮐</tspan>
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

  computed: {
    snippet(): string {
      return this.text.substring(this.span.startOffset, this.span.endOffset);
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
