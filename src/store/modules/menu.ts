export default {
  namespaced: true,
  state: {
    aside: {}
  },
  mutations: {
    loadMenu(state: any, val: any) {
      state.aside = val;
    }
  }
};
