export default {
  namespaced: true,
  state: {
    localLan: {}
  },
  mutations: {
    load(state: any, val: any) {
      state.localLan = val;
    }
  }
};
