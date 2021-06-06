import { mount } from '@vue/test-utils';
import SearchResults from '@/components/SearchResults.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import Search from '@/views/Search.vue';
import WordPage from '@/views/WordPage.vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createStore } from 'vuex';
import { nextTick } from 'vue';
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
  const routes = [
    {
      path: '/',
      name: 'search',
      component: Search,
    },
    {
      path: '/words/:simplified',
      name: 'wordDetail',
      component: WordPage,
    },
  ];
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });
  const wrapper = mount(SearchResults, {
    global: {
      plugins: [PrimeVue, store, router],
    },
  });
  return { store, wrapper, router };
};

describe('SearchResults', () => {
  test('Checks if the component got mounted', async () => {
    const { store, wrapper, router } = factory();
    await router.isReady();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(true);
    // let's also check that the currentWords is also blank
    expect(store.state.search.currentWords.size).toEqual(0);
  });
  test('Checks if WordCards are shown', async () => {
    const { store, wrapper, router } = factory();
    await router.isReady();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(true);
    // manually set the state of our search module state
    store.state.search = initialSearchStore;

    await nextTick();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(false);
    // there should be 9 cards shown, so there should be 9 cardTtles
    const cardTitles = wrapper.findAll('.p-card-title');
    expect(cardTitles.length).toEqual(9);
    const cardWords = ['我们', '是', '是', '你们', '的', '的', '的', '的', '朋友'];
    // now let's iterate over each cardWord and each cardTitle
    // let's zip them together...yes Python I know
    const cardTitlesAndWords = zip(cardTitles, cardWords);
    cardTitlesAndWords.forEach(([cardTitle, word]) => {
      // now check the text in each one and compare with the word in the array
      expect(cardTitle.text()).toEqual(word);
    });
  });
});
