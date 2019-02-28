import Vue from 'vue'
import Vuex from 'vuex'

import fs from 'fs'
import path from 'path'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: [],
    selectedItemDetails: null,
    markedWatched: null,
    searchInput: ''
  },
  mutations: {
    // Per convention, mutation functions are capitalized to distinguish them from other functions.
    SET_DATA (state, data) {
      state.data = data
    },
    SET_DETAILS (state, selectedItemDetails) {
      state.selectedItemDetails = selectedItemDetails
    },
    TOGGLE_WATCHED (state, givenId) {
      state.data.find(id => {
        return id.isWatched === !givenId.isWatched
      })
    },
    UPDATE_SEARCH_INPUT (state, input) {
      state.searchInput = input
    },
    PUSH_TO_DATA (state, itemObj) {
      console.log('Before push size:', state.data.length)
      state.data.push(itemObj)
      console.log('After push size:', state.data.length)
    }
  },
  actions: {
    loadDatabase ({ commit }) {
      const publicFolder = path.resolve('./public')
      fs.readFile(path.join(publicFolder, 'database.json'), 'utf8', (err, data) => {
        if (err) alert(err.message)
        commit('SET_DATA', JSON.parse(data))
      })
    },
    updateDetailById ({ commit, getters }, givenId) {
      commit('SET_DETAILS', getters.filterById(givenId))
    },
    async toggleWatched ({ commit, dispatch }, givenId) {
      await commit('TOGGLE_WATCHED', givenId)
      // dispatch('writeUpdatedDatabase')
    },
    async pushToData ({ commit, dispatch }, item) {
      await commit('PUSH_TO_DATA', item)
      // dispatch('writeUpdatedDatabase')
    },
    updateSearchInput ({ commit }, input) {
      commit('UPDATE_SEARCH_INPUT', input)
    },
    // TODO: trigger write out at exit OR prevent the DOM flashing
    writeUpdatedDatabase: context => {
      const publicFolder = path.resolve('./public')
      fs.writeFileSync(path.join(publicFolder, 'database.json'), JSON.stringify(context.state.data), 'utf8').catch(err => alert(err.message))
    }
  },
  getters: {
    getMovies: state => state.data.filter(item => item.mediaType === 'movie'),
    // getTv: state => state.data.filter(item => item.mediaType === 'tv'),
    getSelectedDetail: state => state.selectedItemDetails,
    filterById: state => givenId => state.data.filter(item => item.id === givenId)[0],
    filterByTitle: state => state.data.filter(item => item.title.toLowerCase().includes(state.searchInput.toLowerCase()))
  }
})
