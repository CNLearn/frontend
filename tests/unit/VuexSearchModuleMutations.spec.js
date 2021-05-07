import search from '@/store/modules/search';
import { createStore } from 'vuex';

const factory = () => {
  const store = createStore({
    modules: {
      search,
    },
  });
  return store;
};

describe('Vuex Search Module Mutations', () => {
  test('Tests SET_SEARCH_STRING mutation', () => {
    const store = factory();
    expect(store.state.search.searchString).toBe('');
    store.commit('search/SET_SEARCH_STRING', '你们不好');
    expect(store.state.search.searchString).toBe('你们不好');
  });
  test('Tests CLEAR_SEGMENTED_WORDS mutation', () => {
    const store = factory();
    expect(store.state.search.segmentedWords.size).toEqual(0);
    // let's manually add some words in there
    // note that I am not using the mutation, I am setting the state directly
    const segmentedWordsArray = ['我们', '是', '你们', '的', '朋友'];
    segmentedWordsArray.forEach((word, index) => {
      store.state.search.segmentedWords.set(index, word);
    });
    expect(store.state.search.segmentedWords.size).toEqual(5);
    // now let's use the mutation tested here
    store.commit('search/CLEAR_SEGMENTED_WORDS');
    // now the size should be 0 again
    expect(store.state.search.segmentedWords.size).toEqual(0);
  });
  test('Tests ADD_TO_SEGMENTED_WORDS mutation', () => {
    const store = factory();
    expect(store.state.search.segmentedWords.size).toEqual(0);
    const wordsArray = ['我们', '是', '你们'];
    // commit the mutation, size should increase by one after each mutation
    wordsArray.forEach((word, index) => {
      const initialCount = index;
      const finalCount = index + 1;
      const wordObject = {
        position: index,
        simplified: word,
      };
      expect(store.state.search.segmentedWords.size).toEqual(initialCount);
      store.commit('search/ADD_TO_SEGMENTED_WORDS', wordObject);
      expect(store.state.search.segmentedWords.size).toEqual(finalCount);
    });
    wordsArray.forEach((word, index) => {
      expect(store.state.search.segmentedWords.get(index)).toBe(word);
    });
  });
  test('Tests the ADD_TO_CACHE mutation', () => {
    const store = factory();
    // the cache is initially empty
    expect(store.state.search.cachedWords.size).toEqual(0);
    // add some fake data
    const wordsArray = ['我们', '是', '你们'];
    wordsArray.forEach((word, index) => {
      const initialCount = index;
      const finalCount = index + 1;
      const wordObject = {
        simplified: word,
        data: 'fake data',
      };
      expect(store.state.search.cachedWords.size).toEqual(initialCount);
      store.commit('search/ADD_TO_CACHE', wordObject);
      expect(store.state.search.cachedWords.size).toEqual(finalCount);
    });
    wordsArray.forEach((word) => {
      expect(store.state.search.cachedWords.has(word)).toBe(true);
    });
  });
  test('Tests the ADD_TO_CURRENT_WORDS mutation', () => {
    const store = factory();
    // the currentWords is initially empty
    const wordsArray = ['我们', '是', '你们'];
    wordsArray.forEach((word, index) => {
      const initialCount = index;
      const finalCount = index + 1;
      expect(store.state.search.currentWords.size).toEqual(initialCount);
      store.commit('search/ADD_TO_CURRENT_WORDS', word);
      expect(store.state.search.currentWords.size).toEqual(finalCount);
    });
    wordsArray.forEach((word) => {
      expect(store.state.search.currentWords.has(word)).toBe(true);
    });
  });
  test('Tests the CLEAR_CURRENT_WORDS mutation', () => {
    const store = factory();
    // the currentWords is currently empty
    expect(store.state.search.currentWords.size).toEqual(0);
    // let's add a few things to it
    const wordsArray = ['我们', '是', '你们'];
    wordsArray.forEach((word) => store.state.search.currentWords.add(word));
    expect(store.state.search.currentWords.size).toEqual(3);
    // now let's use the mutation
    store.commit('search/CLEAR_CURRENT_WORDS');
    // now should be empty again
    expect(store.state.search.currentWords.size).toEqual(0);
  });
});
