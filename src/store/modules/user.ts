export default {
  namespaced: true,
  state: {
    info: {
      name: 1
    }
  },
  mutations: {
    setInfo(state: any, val: any) {
      state.info = val;
    }
  }
};
