<template>
  <div id="app">
    <button @click="changeText">Change text</button>
    <button @click="resetEntity">Reset entity</button>
    <button @click="changeLabel">Change label</button>
    <button @click="allowOverlapping = !allowOverlapping">
      Allow overlapping({{ allowOverlapping }})
    </button>
    <v-annotator
      :allow-overlapping="allowOverlapping"
      :text="text"
      :entities="JSON.stringify(entities)"
      :entity-labels="entityLabels"
      :rtl="rtl"
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
      allowOverlapping: false,
      id: 5,
      // text: "من ويكيبيديا، الموسوعة الحرة\nداستان SVG Tiny 1.2 طولا ني است.",
      // rtl: true,
      // text: "👶🏻👦🏻👧🏻👨🏻👩🏻👱🏻‍♀️👱🏻👴🏻👵🏻👲🏻👳🏻‍♀️👳🏻👮🏻‍♀️👮🏻👷🏻‍♀️👷🏻💂🏻‍♀️💂🏻🕵🏻‍♀️👩🏻‍⚕️👨🏻‍⚕️👩🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾"
      rtl: false,
      text: "👶🏻👦🏻👧🏻👨🏻👩🏻👱🏻‍♀️👱🏻👴🏻👵🏻👲🏻👳🏻‍♀️👳🏻👮🏻‍♀️👮🏻👷🏻‍♀️👷🏻💂🏻‍♀️💂🏻🕵🏻‍♀️👩🏻‍⚕️👨🏻‍⚕️👩🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾👨🏻‍🌾\nwe must respect the will of the individual.\nTake it easy I can assure you that everything will turn out to be fine.\n".repeat(
        1//0000
      ),
      entities: [
        // {
        //   id: 0,
        //   user: 0,
        //   label: 0,
        //   startOffset: 3,
        //   endOffset: 7,
        // },
        // {
        //   id: 4,
        //   user: 0,
        //   label: 0,
        //   startOffset: 35,
        //   endOffset: 46,
        // },
        // {
        //   id: 1,
        //   user: 0,
        //   label: 1,
        //   startOffset: 59,
        //   endOffset: 62,
        // },
        // {
        //   id: 2,
        //   user: 0,
        //   label: 0,
        //   startOffset: 79,
        //   endOffset: 89,
        // },
        // {
        //   id: 3,
        //   user: 0,
        //   label: 1,
        //   startOffset: 79,
        //   endOffset: 94,
        // },
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
    // for (let i = 0; i < 10000; i++) {
    //   this.addEntity(i * 10 + 100, i * 10 + 105);
    // }
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
    changeText() {
      this.text = "The president Obama came to Japan.";
      this.entities = [];
    },
    resetEntity() {
      this.entities = [];
    },
    changeLabel() {
      this.entityLabels[0].color = "#FF5733";
      this.entityLabels[0].text = "Misc";
    },
  },
});
</script>
