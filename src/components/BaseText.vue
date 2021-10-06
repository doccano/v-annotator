<template>
  <text
    v-if="snippet"
    v-text="snippet"
    fill="currentColor"
    style="white-space: pre"
  />
  <text v-else style="font-size: 6px" fill="currentColor">⮐</text>
</template>

<script lang="ts">
import { TextLine } from "../domain/models/Line/LineText";
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
    textLine: {
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

<style scoped>
text {
  white-space: pre;
}
</style>
