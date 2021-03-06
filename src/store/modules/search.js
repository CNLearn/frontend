import { extractChineseCharactersToString } from "@/utilities/chinese";
import { Segment, useDefault } from "segmentit";
import Dictionary from "@/services/Dictionary";

const segmentit = useDefault(new Segment());

const search = {
  namespaced: true,
  state: () => ({
    searchString: "",
    searchHistory: new Map(),
    segmentedWords: new Map(),
    cachedWords: new Map(),
    currentWords: new Set()
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
    ADD_TO_CACHE(state, wordObject) {
      const { simplified, data } = wordObject;
      state.cachedWords.set(simplified, data);
    },
    ADD_TO_CURRENT_WORDS(state, simplified) {
      state.currentWords.add(simplified);
    },
    CLEAR_CURRENT_WORDS(state) {
      state.currentWords.clear();
    },
    UPDATE_HISTORY(state, word) {
      let wordHistory = state.searchHistory.get(word.simplified) || 0;
      wordHistory += 1;
      state.searchHistory.set(word.simplified, wordHistory);
    }
  },
  actions: {
    setSearch({ commit }, searchString) {
      commit("SET_SEARCH_STRING", searchString);
    },
    search({ dispatch, commit }, searchString) {
      commit("CLEAR_CURRENT_WORDS");
      const chineseString = extractChineseCharactersToString(searchString);
      dispatch("setSearch", chineseString);
      // segment the words
      const segmentedWordsArray = segmentit.doSegment(chineseString, {
        simple: true,
        stripPunctuation: true
      });
      dispatch("addToSegmentedWords", segmentedWordsArray);
      // then do the actual word search
      dispatch("findWords", segmentedWordsArray);
    },
    addToSegmentedWords({ commit }, segmentedWordsArray) {
      // clear the current segmented words
      commit("CLEAR_SEGMENTED_WORDS");
      segmentedWordsArray.forEach((word, index) =>
        commit("ADD_TO_SEGMENTED_WORDS", { position: index, simplified: word })
      );
    },
    addToCache({ commit }, wordObject) {
      commit("ADD_TO_CACHE", wordObject);
    },
    addToCurrentWords({ commit }, simplified) {
      commit("ADD_TO_CURRENT_WORDS", simplified);
    },
    addToHistory({ commit, state }, word) {
      // let's only do the commit if the word is not already in current words, otherwise
      // we incremenent it whenever a search string is extended
      const currentWordsArray = [...state.currentWords];

      if (!currentWordsArray.includes(word.simplified)) {
        commit("UPDATE_HISTORY", { simplified: word.simplified });
      }
    },
    async findWords({ dispatch, state }, words) {
      /* eslint-disable no-restricted-syntax */
      for (const word of words) {
        if (!state.cachedWords.has(word)) {
          try {
            /* eslint-disable no-await-in-loop */
            const response = await Dictionary.getWord(word);
            if (!(response.data.length === 0)) {
              const wordObject = {
                simplified: word,
                data: response.data
              };
              dispatch("addToCache", wordObject);
              dispatch("addToCurrentWords", wordObject.simplified);
              dispatch("addToHistory", wordObject);
            } else {
              await dispatch("findWords", [...word]);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          dispatch("addToCurrentWords", word);
          dispatch("addToHistory", { simplified: word });
        }
      }
    }
  },
  getters: {
    getWord: state => simplified => state.cachedWords.get(simplified),
    getSpecificWord: state => (simplified, pos) => state.cachedWords.get(simplified)[pos]
  }
};

export default search;
