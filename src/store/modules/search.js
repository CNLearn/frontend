const search = {
  namespaced: true,
  state: () => ({
    searchString: '',
  }),
  mutations: {
    SET_SEARCH_STRING(state, searchString) {
      state.searchString = searchString;
    },
  },
  actions: {
    setSearch({ commit }, searchString) {
      commit('SET_SEARCH_STRING', searchString);
    },
  },
  getters: {},
};

export default search;
