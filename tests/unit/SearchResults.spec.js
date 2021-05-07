import { mount } from '@vue/test-utils';
import SearchResults from '@/components/SearchResults.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import { createStore } from 'vuex';
import { nextTick } from 'vue';
import { zip } from 'lodash';

const factory = async () => {
  const store = await createStore({
    modules: {
      search,
    },
  });
  const wrapper = await mount(SearchResults, {
    global: {
      plugins: [PrimeVue, store],
    },
  });
  return { store, wrapper };
};

describe('SearchResults', () => {
  test('Checks if the component got mounted', async () => {
    const { store, wrapper } = await factory();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(true);
    // let's also check that the currentWords is also blank
    expect(store.state.search.currentWords.size).toEqual(0);
  });
  test('Checks if currentWords are shown', async () => {
    const { store, wrapper } = await factory();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(true);
    const currentWordsArray = ['我们', '是', '你们', '的', '朋友'];
    currentWordsArray.forEach((word) => {
      store.state.search.currentWords.add(word);
    });
    await nextTick();
    expect(wrapper.find('[data-test="searchResultsDiv"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsFound"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="searchResultsBlank"]').exists()).toBe(false);
    // let's see if we can see the 5 <p></p> items
    const pElements = wrapper.findAll('p');
    // now let's iterate over each pElement and each word in segmentedWordsArray
    // let's zip them together...yes Python I know
    const pElsAndWords = zip(pElements, currentWordsArray);
    pElsAndWords.forEach((pElementAndWord) => {
      const pElement = pElementAndWord[0];
      const word = pElementAndWord[1];
      // now check the text in each one and compare with the word in the array
      expect(pElement.text()).toEqual(word);
    });
  });
});
