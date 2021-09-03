<template>
  <text v-if="snippet" v-text="snippet" />
  <text v-else style="font-size: 6px">⮐</text>
</template>

<script lang="ts">
import { TextLine } from "@/domain/models/Line/TextLine";
import Vue, { PropType } from "vue";

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: "",
      required: true,
    },
    textLine: {
      type: Object as PropType<TextLine>,
      required: true,
    },
  },

  computed: {
    snippet(): string {
      return this.text.substring(
        this.textLine.startOffset,
        this.textLine.endOffset
      );
    },
  },

  watch: {
    span: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          (
            this.$el as unknown as { annotatorElement: TextLine }
          ).annotatorElement = this.textLine;
        });
      },
    },
  },
});
</script>
