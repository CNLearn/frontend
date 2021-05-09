import search from '@/store/modules/search';
import { createStore } from 'vuex';
import { zip } from 'lodash';

const initialSearchStore = {
  searchString: '我们是你们的朋友',
  segmentedWords: new Map([
    [0, '我们'],
    [1, '是'],
    [2, '你们'],
    [3, '的'],
    [4, '朋友'],
  ]),
  cachedWords: new Map([
    ['我们', [{
      id: 40809,
      simplified: '我们',
      traditional: '我們',
      pinyin_num: 'wo3 men5',
      pinyin_accent: 'wǒ men',
      pinyin_clean: 'wo men',
      pinyin_no_spaces: 'women',
      also_written: '',
      classifiers: '',
      definitions: 'we; us; ourselves; our',
      frequency: 283794,
    }]],
    ['是', [{
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
    }]],
    ['你们', [{
      id: 6948,
      simplified: '你们',
      traditional: '你們',
      pinyin_num: 'ni3 men5',
      pinyin_accent: 'nǐ men',
      pinyin_clean: 'ni men',
      pinyin_no_spaces: 'nimen',
      also_written: '',
      classifiers: '',
      definitions: 'you (plural)',
      frequency: 46411,
    }]],
    ['的', [{
      id: 71685,
      simplified: '的',
      traditional: '的',
      pinyin_num: 'de5',
      pinyin_accent: 'de',
      pinyin_clean: 'de',
      pinyin_no_spaces: 'de',
      also_written: '',
      classifiers: '',
      definitions: "of; ~'s (possessive particle); (used after an attribute); (used to form a nominal expression); (used at the end of a declarative sentence for emphasis)",
      frequency: 4540297,
    },
    {
      id: 71686,
      simplified: '的',
      traditional: '的',
      pinyin_num: 'di1',
      pinyin_accent: 'dī',
      pinyin_clean: 'di',
      pinyin_no_spaces: 'di',
      also_written: '',
      classifiers: '',
      definitions: 'see 的士(dī shì)',
      frequency: 4540297,
    },
    {
      id: 71687,
      simplified: '的',
      traditional: '的',
      pinyin_num: 'di2',
      pinyin_accent: 'dí',
      pinyin_clean: 'di',
      pinyin_no_spaces: 'di',
      also_written: '',
      classifiers: '',
      definitions: 'really and truly',
      frequency: 4540297,
    },
    {
      id: 71688,
      simplified: '的',
      traditional: '的',
      pinyin_num: 'di4',
      pinyin_accent: 'dì',
      pinyin_clean: 'di',
      pinyin_no_spaces: 'di',
      also_written: '',
      classifiers: '',
      definitions: 'aim; clear',
      frequency: 4540297,
    }]],
    ['朋友', [{
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
    }]],
  ]),
  currentWords: new Set(['我们', '是', '你们', '的', '朋友']),
};

const factory = () => {
  const store = createStore({
    modules: {
      search,
    },
  });
  // manually set the state of our search module state
  store.state.search = initialSearchStore;
  return store;
};

describe('Vuex Search Module Getters', () => {
  test('Tests the getWord getter', () => {
    const store = factory();
    const getWord = store.getters['search/getWord'];
    const wordsToTest = ['我们', '是', '你们', '的', '朋友'];
    wordsToTest.forEach((word) => {
      expect(getWord(word)).toEqual(initialSearchStore.cachedWords.get(word));
    });
  });
  test('Tests the getSpecificWord getter', () => {
    const store = factory();
    const getSpecificWord = store.getters['search/getSpecificWord'];
    const wordsToTest = ['我们', '是', '是', '你们', '的', '的', '的', '的', '朋友'];
    const positions = [0, 0, 1, 0, 0, 1, 2, 3, 0];
    const wordsAndPositions = zip(wordsToTest, positions);
    wordsAndPositions.forEach(([word, position]) => {
      expect(getSpecificWord(word, position))
        .toEqual(initialSearchStore.cachedWords.get(word)[position]);
    });
  });
});
