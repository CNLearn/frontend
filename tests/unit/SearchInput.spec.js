import { mount, flushPromises } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import { createStore } from 'vuex';
import Dictionary from '@/services/Dictionary';

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
  const wrapper = mount(SearchInput, {
    global: {
      plugins: [PrimeVue, store],
    },
  });

  return { store, wrapper };
};

describe('SearchInput', () => {
  test('Checks if inputting values works', async () => {
    const { store, wrapper } = factory();
    const mockData1 = [
      {
        id: 6949,
        simplified: '你好',
        traditional: '你好',
        pinyin_num: 'ni3 hao3',
        pinyin_accent: 'nǐ hǎo',
        pinyin_clean: 'ni hao',
        pinyin_no_spaces: 'nihao',
        also_written: '',
        classifiers: '',
        definitions: 'hello; hi',
        frequency: 6639327,
      },
    ];
    const mockData2 = [
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
    const mockData3 = [
      {
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
    ];
    const mockData4 = [
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
      .mockResolvedValueOnce({ data: mockData4 });

    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
    // set the searchString data using setData method
    await wrapper.setData({ localSearchString: '你好' });
    // now that will dispatch the searchAction
    // let's wait for the actions to happen
    await flushPromises();

    expect(Dictionary.getWord).toHaveBeenCalledTimes(1);
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(true);
    const searchString = wrapper.find(
      '[data-test="searchString"]',
    ).element.textContent;
    expect(searchString).toBe('你好');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('你好');

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="searchBox"]').setValue('我们的朋友');
    // let's wait for the actions to happen
    await flushPromises();
    expect(Dictionary.getWord).toHaveBeenCalledTimes(4);
    const updatedSearchString = wrapper.find('[data-test="searchString"]').element.textContent;
    expect(updatedSearchString).toBe('我们的朋友');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('我们的朋友');
  });
  test('Checks if the component got mounted', () => {
    const { store, wrapper } = factory();
    expect(wrapper.find('[data-test="searchedFor"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchBox"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(false);
    // let's also check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
  });
  test('Checks that the search value is blank in a new test', () => {
    const { store } = factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
  });
  test('Checks if anything that is not a Chinese character gets filtered out', async () => {
    const { store, wrapper } = factory();
    const mockData1 = [
      {
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
    const mockData3 = [
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
    const mockData4 = [
      {
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
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
    // set the searchString data using setData method
    await wrapper.setData({ localSearchString: '你们是our friends' });
    // let's wait for the actions to happen
    await flushPromises();
    expect(Dictionary.getWord).toHaveBeenCalledTimes(2);
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(true);
    const searchString = wrapper.find(
      '[data-test="searchString"]',
    ).element.textContent;
    expect(searchString).toBe('你们是');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('你们是');

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="searchBox"]').setValue('我们的朋友are you');
    // let's wait for the actions to happen
    await flushPromises();
    expect(Dictionary.getWord).toHaveBeenCalledTimes(5);
    const updatedSearchString = wrapper.find('[data-test="searchString"]').element.textContent;
    expect(updatedSearchString).toBe('我们的朋友');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('我们的朋友');
  });
});
