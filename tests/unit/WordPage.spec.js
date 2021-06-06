import { mount, flushPromises } from '@vue/test-utils';
import WordPage from '@/views/WordPage.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import Search from '@/views/Search.vue';
import { createStore } from 'vuex';
import { createWebHistory, createRouter } from 'vue-router';
import { zip } from 'lodash';
import Dictionary from '@/services/Dictionary';

jest.mock('@/services/Dictionary');
beforeEach(() => {
  jest.clearAllMocks();
});

const factory = async (searchInitialState, simplified) => {
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
    routes,
    history: createWebHistory(),
  });

  // manually set the state of our search module state
  store.state.search = searchInitialState;
  const wrapper = mount(WordPage, {
    global: {
      mocks: {
        $route: {
          params: { simplified },
        },
      },
      plugins: [PrimeVue, store, router],
    },
  });

  return { store, wrapper, router };
};

describe('WordPage', () => {
  test('Checks if the view component got mounted and got the information from the state', async () => {
    const initialSearchStore = {
      searchString: '我们',
      segmentedWords: new Map([
        [0, '我们'],
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
      ]),
      currentWords: new Set(['我们']),
    };
    const { store, wrapper, router } = await factory(initialSearchStore, '我们');
    await router.isReady();
    // test the header
    const header = wrapper.find('h2');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe('我们 wǒ men');
    // check the definitions part
    expect(wrapper.find('h3').text()).toBe('Definitions');
    // definitions wrapper elements
    const definitions = store.state.search.cachedWords.get('我们')[0].definitions.split(';');
    const definitionElements = wrapper.findAll('li');
    const defElementsAndDefinitions = zip(definitionElements, definitions);
    defElementsAndDefinitions.forEach(([defElement, definition]) => {
      expect(defElement.text()).toEqual(definition.trim());
    });
  });
  test('Checks if the view component got mounted and then dispatched an action to get the necessary data', async () => {
    const initialSearchStore = {
      searchString: '',
      segmentedWords: new Map(),
      cachedWords: new Map(),
      currentWords: new Set(),
    };
    const mockData = [
      {
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
      },
    ];
    Dictionary.getWord.mockResolvedValueOnce({ data: mockData });
    const { store, wrapper, router } = await factory(initialSearchStore, '我们');
    await router.isReady();
    // now that will dispatch the findWords action
    // let's wait for the actions to happen
    await flushPromises();

    expect(Dictionary.getWord).toHaveBeenCalledTimes(1);

    // test the header
    const header = wrapper.find('h2');
    expect(header.exists()).toBe(true);
    expect(header.text()).toBe('我们 wǒ men');
    // check the definitions part
    expect(wrapper.find('h3').text()).toBe('Definitions');
    // definitions wrapper elements
    const definitions = store.state.search.cachedWords.get('我们')[0].definitions.split(';');
    const definitionElements = wrapper.findAll('li');
    const defElementsAndDefinitions = zip(definitionElements, definitions);
    defElementsAndDefinitions.forEach(([defElement, definition]) => {
      expect(defElement.text()).toEqual(definition.trim());
    });
  });
  test('Checks if the view component got mounted and then dispatched an action multiple times', async () => {
    const initialSearchStore = {
      searchString: '',
      segmentedWords: new Map(),
      cachedWords: new Map(),
      currentWords: new Set(),
    };
    const mockData1 = [];
    const mockData2 = [{
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
    }];
    const mockData3 = [{
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
    }];

    Dictionary.getWord.mockResolvedValueOnce({ data: mockData1 })
      .mockResolvedValueOnce({ data: mockData2 })
      .mockResolvedValueOnce({ data: mockData3 });
    const { store, wrapper, router } = await factory(initialSearchStore, '的是');
    await router.isReady();
    // now that will dispatch the findWords action
    // let's wait for the actions to happen
    await flushPromises();

    expect(Dictionary.getWord).toHaveBeenCalledTimes(3);

    // test that no word is found
    const noWord = wrapper.find('p');
    expect(noWord.text()).toBe('No such word exists. Please go back to the  search page  and check if any words were found.');
    // check for link back to search page
    const linkToSearch = wrapper.find('a');
    expect(linkToSearch.html()).toBe('<a href="/" class="router-link-active router-link-exact-active" aria-current="page"> search page </a>');
    // check the words that are now present in cachedWords
    expect(store.state.search.cachedWords.get('的')).toEqual(mockData2);
    expect(store.state.search.cachedWords.get('是')).toEqual(mockData3);
  });
  test('Checks if the view component got mounted and no actions were dispatched', async () => {
    const initialSearchStore = {
      searchString: '',
      segmentedWords: new Map(),
      cachedWords: new Map(),
      currentWords: new Set(),
    };
    const { wrapper, router } = await factory(initialSearchStore, 'hi');
    await router.isReady();
    // now that will dispatch the findWords action
    // let's wait for the actions to happen
    await flushPromises();
    // test that no word is found
    const noWord = wrapper.find('p');
    expect(noWord.text()).toBe('No such word exists. Please go back to the  search page  and check if any words were found.');
    // check for link back to search page
    const linkToSearch = wrapper.find('a');
    expect(linkToSearch.html()).toBe('<a href="/" class="router-link-active router-link-exact-active" aria-current="page"> search page </a>');
    // check the words that are now present in cachedWords
  });
});
