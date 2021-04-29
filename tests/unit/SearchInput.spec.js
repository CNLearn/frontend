import { mount } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import { createStore } from 'vuex';

const factory = () => {
  const store = createStore({
    modules: {
      search
    }
  });
  const wrapper = mount(SearchInput, {
    global: {
      plugins: [PrimeVue, store]
    }
  });
  return { store, wrapper };
}

describe('SearchInput', () => {

  test('Checks if inputting values works', async () => {
    const { store, wrapper } = factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('')
    // set the searchString data using setData method
    await wrapper.setData({ localSearchString: "hello" })
    expect(wrapper.find('[data-test="search_string"]').exists()).toBe(true)
    const search_string = wrapper.find(
      '[data-test="search_string"]').element.textContent
    expect(search_string).toBe("hello")
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('hello')

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="search_box"]').setValue("general")
    const updated_search_string = wrapper.find('[data-test="search_string"]').element.textContent
    expect(updated_search_string).toBe("general")
    // let's check the store state as well (obviously should pass if above passes)
    expect(store.state.search.searchString).toBe('general')
  });
  test('Checks if the component got mounted', async () => {
    const { store, wrapper } = factory();
    expect(wrapper.find('[data-test="searched_for"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="search_box"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="search_string"]').exists()).toBe(false)
    // let's also check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('')
  });
  test('Checks that the search value is blank in a new test', async () => {
    const { store, wrapper } = factory();
    // first check that the searchString in the search module state is null
    expect(store.state.search.searchString).toBe('')
  });
});
