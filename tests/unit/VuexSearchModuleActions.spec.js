import search from '@/store/modules/search';
import { createStore } from 'vuex';
import Dictionary from '@/services/Dictionary';
import { flushPromises } from '@vue/test-utils';

jest.mock('@/services/Dictionary');
beforeEach(() => {
  jest.clearAllMocks();
});

const factory = () => {
  const store = createStore({
    modules: {
      search,
    },
  });
  return store;
};

describe('Vuex Search Module Actions', () => {
  test('Tests setSearch action', () => {
    const store = factory();
    expect(store.state.search.searchString).toBe('');
    store.dispatch('search/setSearch', '你们不好');
    expect(store.state.search.searchString).toBe('你们不好');
  });
  test('Tests addToSegmentedWords action', () => {
    const store = factory();
    expect(store.state.search.segmentedWords.size).toEqual(0);
    const wordsArray = ['我们', '是', '你们'];
    // dispatch the action, size should increase by three
    store.dispatch('search/addToSegmentedWords', wordsArray);
    expect(store.state.search.segmentedWords.size).toEqual(wordsArray.length);
  });
  test('Tests addToCache action', () => {
    const store = factory();
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
      store.dispatch('search/addToCache', wordObject);
      expect(store.state.search.cachedWords.size).toEqual(finalCount);
    });
    wordsArray.forEach((word) => {
      expect(store.state.search.cachedWords.has(word)).toBe(true);
    });
  });
  test('Tests the addToCurrentWords action', () => {
    const store = factory();
    // the currentWords is initially empty
    const wordsArray = ['我们', '是', '你们'];
    wordsArray.forEach((word, index) => {
      const initialCount = index;
      const finalCount = index + 1;
      expect(store.state.search.currentWords.size).toEqual(initialCount);
      store.dispatch('search/addToCurrentWords', word);
      expect(store.state.search.currentWords.size).toEqual(finalCount);
    });
    wordsArray.forEach((word) => {
      expect(store.state.search.currentWords.has(word)).toBe(true);
    });
  });
  test('Tests the findWords action (1) - empty cache - all words are found', async () => {
    const store = factory();
    const mockData = [
      {
        id: 40806,
        simplified: '我',
        traditional: '我',
        pinyin_num: 'wo3',
        pinyin_accent: 'wǒ',
        pinyin_clean: 'wo',
        pinyin_no_spaces: 'wo',
        also_written: '',
        classifiers: '',
        definitions: 'I; me; my',
        frequency: 1293594,
      },
    ];

    Dictionary.getWord.mockResolvedValueOnce({ data: mockData });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word = '我';
    await store.dispatch('search/findWords', [word]);
    // test if the correct API endpoint was called
    expect(Dictionary.getWord).toHaveBeenCalledTimes(1);
    expect(store.state.search.currentWords.size).toEqual(1);
    expect(store.state.search.currentWords.has(word)).toBe(true);
  });
  test('Tests the findWords action (2) - empty cache - two words are found', async () => {
    const store = factory();
    const mockData1 = [
      {
        id: 40806,
        simplified: '我',
        traditional: '我',
        pinyin_num: 'wo3',
        pinyin_accent: 'wǒ',
        pinyin_clean: 'wo',
        pinyin_no_spaces: 'wo',
        also_written: '',
        classifiers: '',
        definitions: 'I; me; my',
        frequency: 1293594,
      },
    ];
    const mockData2 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word1 = '我';
    const word2 = '是';
    await store.dispatch('search/findWords', [word1, word2]);
    // test if the correct API endpoint was called
    expect(Dictionary.getWord).toHaveBeenCalledTimes(2);
    expect(store.state.search.currentWords.size).toEqual(2);
    expect(store.state.search.currentWords.has(word1)).toBe(true);
    expect(store.state.search.currentWords.has(word2)).toBe(true);
  });
  test('Tests the findWords action (3) - empty cache - 1 word found, 1 not found, split into 2 that are found', async () => {
    const store = factory();
    const mockData1 = [
      {
        id: 40806,
        simplified: '我',
        traditional: '我',
        pinyin_num: 'wo3',
        pinyin_accent: 'wǒ',
        pinyin_clean: 'wo',
        pinyin_no_spaces: 'wo',
        also_written: '',
        classifiers: '',
        definitions: 'I; me; my',
        frequency: 1293594,
      },
    ];
    const mockData2 = [];
    const mockData3 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    const mockData4 = [
      {
        id: 94175,
        simplified: '谁',
        traditional: '誰',
        pinyin_num: 'shei2',
        pinyin_accent: 'shéi',
        pinyin_clean: 'shei',
        pinyin_no_spaces: 'shei',
        also_written: '',
        classifiers: '',
        definitions: 'who',
        frequency: 46737,
      },
    ];
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 })
      .mockResolvedValueOnce({ data: mockData3 })
      .mockResolvedValueOnce({ data: mockData4 });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word1 = '我';
    const word2 = '是谁';
    const word3 = '是';
    const word4 = '谁';
    await store.dispatch('search/findWords', [word1, word2]);
    // test if the correct API endpoint was called
    expect(Dictionary.getWord).toHaveBeenCalledTimes(4);
    expect(store.state.search.currentWords.size).toEqual(3);
    expect(store.state.search.currentWords.has(word1)).toBe(true);
    expect(store.state.search.currentWords.has(word2)).toBe(false);
    expect(store.state.search.currentWords.has(word3)).toBe(true);
    expect(store.state.search.currentWords.has(word4)).toBe(true);
  });
  test('Tests the findWords action (4) - empty cache - 1 word found, 1 not found, split into 2 that are found, 1 found', async () => {
    const store = factory();
    const mockData1 = [
      {
        id: 40806,
        simplified: '我',
        traditional: '我',
        pinyin_num: 'wo3',
        pinyin_accent: 'wǒ',
        pinyin_clean: 'wo',
        pinyin_no_spaces: 'wo',
        also_written: '',
        classifiers: '',
        definitions: 'I; me; my',
        frequency: 1293594,
      },
    ];
    const mockData2 = [];
    const mockData3 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    const mockData4 = [
      {
        id: 94175,
        simplified: '谁',
        traditional: '誰',
        pinyin_num: 'shei2',
        pinyin_accent: 'shéi',
        pinyin_clean: 'shei',
        pinyin_no_spaces: 'shei',
        also_written: '',
        classifiers: '',
        definitions: 'who',
        frequency: 46737,
      },
    ];
    const mockData5 = [
      {
        id: 51254,
        simplified: '朋友',
        traditional: '朋友',
        pinyin_num: 'peng2 you5',
        pinyin_accent: 'péng you',
        pinyin_clean: 'peng you',
        pinyin_no_spaces: 'pengyou',
        also_written: '',
        classifiers: '个; 位',
        definitions: 'friend',
        frequency: 39168,
      },
    ];
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 })
      .mockResolvedValueOnce({ data: mockData3 })
      .mockResolvedValueOnce({ data: mockData4 })
      .mockResolvedValueOnce({ data: mockData5 });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word1 = '我';
    const word2 = '是谁';
    const word3 = '是';
    const word4 = '谁';
    const word5 = '朋友';
    await store.dispatch('search/findWords', [word1, word2, word5]);
    // test if the correct API endpoint was called
    expect(Dictionary.getWord).toHaveBeenCalledTimes(5);
    expect(store.state.search.currentWords.size).toEqual(4);
    expect(store.state.search.currentWords.has(word1)).toBe(true);
    expect(store.state.search.currentWords.has(word2)).toBe(false);
    expect(store.state.search.currentWords.has(word3)).toBe(true);
    expect(store.state.search.currentWords.has(word4)).toBe(true);
    expect(store.state.search.currentWords.has(word5)).toBe(true);
  });
  test('Tests the findWords action (5) - one word in cache - two words are found (one called from API)', async () => {
    const store = factory();
    const mockData1 = [
      {
        id: 40806,
        simplified: '我',
        traditional: '我',
        pinyin_num: 'wo3',
        pinyin_accent: 'wǒ',
        pinyin_clean: 'wo',
        pinyin_no_spaces: 'wo',
        also_written: '',
        classifiers: '',
        definitions: 'I; me; my',
        frequency: 1293594,
      },
    ];
    const mockData2 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    // let's add mockData1 to cache (simulating a previous search)
    store.state.search.cachedWords.set('我', mockData1);
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData2 });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word1 = '我';
    const word2 = '是';
    await store.dispatch('search/findWords', [word1, word2]);
    // test if the correct API endpoint was called
    expect(Dictionary.getWord).toHaveBeenCalledTimes(1);
    expect(store.state.search.currentWords.size).toEqual(2);
    expect(store.state.search.currentWords.has(word1)).toBe(true);
    expect(store.state.search.currentWords.has(word2)).toBe(true);
  });
  test('Tests the findWords action (6) - two words in cache - two words are found (one called from API)', async () => {
    // this test is an example of one where the segmenter splits into a word that does
    // not exist. "是谁" so it will still call for it even though both 是 and 谁 are in the cache
    const store = factory();
    const mockData1 = [];
    const mockData2 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    const mockData3 = [
      {
        id: 94175,
        simplified: '谁',
        traditional: '誰',
        pinyin_num: 'shei2',
        pinyin_accent: 'shéi',
        pinyin_clean: 'shei',
        pinyin_no_spaces: 'shei',
        also_written: '',
        classifiers: '',
        definitions: 'who',
        frequency: 46737,
      },
    ];
    // let's add mockData1 and 2 to cache (simulating a previous search)
    store.state.search.cachedWords.set('是', mockData2);
    store.state.search.cachedWords.set('谁', mockData3);
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 });
    // the whole state is empty
    // let's dispatch the action with an array of 1 word
    expect(store.state.search.currentWords.size).toEqual(0);
    const word1 = '是谁';
    const word2 = '是';
    const word3 = '谁';
    await store.dispatch('search/findWords', [word1]);
    // test if the correct API endpoint was called 1 time
    // it was called one time because of segmenter error
    expect(Dictionary.getWord).toHaveBeenCalledTimes(1);
    expect(store.state.search.currentWords.size).toEqual(2);
    expect(store.state.search.currentWords.has(word2)).toBe(true);
    expect(store.state.search.currentWords.has(word3)).toBe(true);
  });
  test('Tests the search action - simple test - 2 words, neither in cache', async () => {
    // this test is an example of one where the segmenter splits into a word that does
    // not exist. "是谁" so it will still call for it even though both 是 and 谁 are in the cache
    const store = factory();
    const mockData1 = [];
    const mockData2 = [
      {
        id: 49583,
        simplified: '是',
        traditional: '是',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'is; are; am; yes; to be',
        frequency: 957407,
      },
      {
        id: 49601,
        simplified: '是',
        traditional: '昰',
        pinyin_num: 'shi4',
        pinyin_accent: 'shì',
        pinyin_clean: 'shi',
        pinyin_no_spaces: 'shi',
        also_written: '',
        classifiers: '',
        definitions: 'variant of 是(shì); (used in given names)',
        frequency: 957407,
      },
    ];
    const mockData3 = [
      {
        id: 94175,
        simplified: '谁',
        traditional: '誰',
        pinyin_num: 'shei2',
        pinyin_accent: 'shéi',
        pinyin_clean: 'shei',
        pinyin_no_spaces: 'shei',
        also_written: '',
        classifiers: '',
        definitions: 'who',
        frequency: 46737,
      },
    ];
    // mock the calls that will happen
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 })
      .mockResolvedValueOnce({ data: mockData3 });
    // the whole state is empty
    expect(store.state.search.currentWords.size).toEqual(0);
    expect(store.state.search.cachedWords.size).toEqual(0);
    expect(store.state.search.segmentedWords.size).toEqual(0);
    // let's dispatch the action with an array of 1 word

    const word1 = '是谁';
    const word2 = '是';
    const word3 = '谁';
    await store.dispatch('search/search', word1);
    // let's wait for the actions to happen
    await flushPromises();
    // test if the correct API endpoint was called 1 time
    // it was called one time because of segmenter error
    expect(Dictionary.getWord).toHaveBeenCalledTimes(3);
    expect(store.state.search.currentWords.size).toEqual(2);
    expect(store.state.search.currentWords.has(word2)).toBe(true);
    expect(store.state.search.currentWords.has(word3)).toBe(true);
    expect(store.state.search.cachedWords.size).toEqual(2);
    expect(store.state.search.cachedWords.has(word2)).toBe(true);
    expect(store.state.search.cachedWords.has(word3)).toBe(true);
  });
});
