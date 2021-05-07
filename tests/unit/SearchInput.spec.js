import { mount } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import { createStore } from 'vuex';

const factory = async () => {
  const store = await createStore({
    modules: {
      search,
    },
  });
  const wrapper = await mount(SearchInput, {
    global: {
      plugins: [PrimeVue, store],
    },
  });
  return { store, wrapper };
};

describe('SearchInput', () => {
  test('Checks if inputting values works', async () => {
    const { store, wrapper } = await factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
    // set the searchString data using setData method
    await wrapper.setData({ localSearchString: '你好' });
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(true);
    const searchString = wrapper.find(
      '[data-test="searchString"]',
    ).element.textContent;
    expect(searchString).toBe('你好');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('你好');

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="searchBox"]').setValue('我们的朋友');
    const updatedSearchString = wrapper.find('[data-test="searchString"]').element.textContent;
    expect(updatedSearchString).toBe('我们的朋友');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('我们的朋友');
  });
  test('Checks if the component got mounted', async () => {
    const { store, wrapper } = await factory();
    expect(wrapper.find('[data-test="searchedFor"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchBox"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(false);
    // let's also check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
  });
  test('Checks that the search value is blank in a new test', async () => {
    const { store } = await factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
  });
  test('Checks if anything that is not a Chinese character gets filtered out', async () => {
    const { store, wrapper } = await factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('');
    // set the searchString data using setData method
    await wrapper.setData({ localSearchString: '你们是our friends' });
    expect(wrapper.find('[data-test="searchString"]').exists()).toBe(true);
    const searchString = wrapper.find(
      '[data-test="searchString"]',
    ).element.textContent;
    expect(searchString).toBe('你们是');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('你们是');

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="searchBox"]').setValue('我们的朋友are you');
    const updatedSearchString = wrapper.find('[data-test="searchString"]').element.textContent;
    expect(updatedSearchString).toBe('我们的朋友');
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('我们的朋友');
  });
});
