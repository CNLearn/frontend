import { extractChineseCharactersToString } from '@/utilities/chinese';
import { Segment, useDefault } from 'segmentit';

const segmentit = useDefault(new Segment());

const search = {
  namespaced: true,
  state: () => ({
    searchString: '',
    segmentedWords: new Map(),
  }),
  mutations: {
    SET_SEARCH_STRING(state, searchString) {
      state.searchString = searchString;
    },
    CLEAR_SEGMENTED_WORDS(state) {
      state.segmentedWords.clear();
    },
    ADD_TO_SEGMENTED_WORDS(state, word) {
      state.segmentedWords.set(word.position, word.simplified);
    },
  },
  actions: {
    setSearch({ commit }, searchString) {
      commit('SET_SEARCH_STRING', searchString);
    },
    search({ dispatch }, searchString) {
      const chineseString = extractChineseCharactersToString(searchString);
      dispatch('setSearch', chineseString);
      // segment the words
      const segmentedWordsArray = segmentit.doSegment(chineseString, {
        simple: true,
        stripPunctuation: true,
      });
      dispatch('addToSegmentedWords', segmentedWordsArray);
      // then do the actual word search
    },
    addToSegmentedWords({ commit }, segmentedWordsArray) {
      // clear the current segmented words
      commit('CLEAR_SEGMENTED_WORDS');
      segmentedWordsArray.forEach((word, index) => (
        commit('ADD_TO_SEGMENTED_WORDS', { position: index, simplified: word })
      ));
    },
  },
  getters: {},
};

export default search;
