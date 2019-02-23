import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    localData: null,
    selectedDetail: null
  },
  mutations: {
    change (state, localData) {
      state.localData = localData
    },
    details (state, selectedDetail) {
      state.selectedDetail = selectedDetail
    }
  },
  actions: {
    localData: state => state.localData,
    selectedDetail: state => state.selectedDetail
  }
})
