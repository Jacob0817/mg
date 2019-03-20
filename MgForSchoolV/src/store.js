import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isGiikerConnected: null,
    phase: 'connect',
  },
  mutations: {
    setGikConed(state){
      state.isGiikerConnected = true
    },
    setGikDisConed(state){
      state.isGiikerConnected = false
    },
    changeGikPhase(state,name){
      state.phase = name
    },
  },
  actions: {

  }
})
