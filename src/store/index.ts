import Vue from "vue";
import Vuex from "vuex";
import { Relation } from "@/domain/models/Label/Relation";
import { Entity } from "@/domain/models/Label/Entity";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    selectedRelation: null as Relation | null,
    selectedEntity: null as Entity | null,
  },
  getters: {
    isSelectedRelation: (state) => (relation: Relation) => {
      return state.selectedRelation === relation;
    },
    isSelectedEntity: (state) => (entity: Entity) => {
      if (state.selectedRelation) {
        return (
          state.selectedRelation!.fromId === entity.id ||
          state.selectedRelation!.toId === entity.id
        );
      } else if (state.selectedEntity) {
        return state.selectedEntity === entity;
      } else {
        return false;
      }
    },
  },
  mutations: {
    setSelectedRelation(state, relation) {
      state.selectedRelation = relation;
    },
    setSelectedEntity(state, entity) {
      state.selectedEntity = entity;
    },
  },
  actions: {},
  modules: {},
});
