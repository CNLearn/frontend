import { mount } from '@vue/test-utils';
import SearchResults from '@/components/SearchResults.vue';
import PrimeVue from 'primevue/config';
import search from '@/store/modules/search';
import { createStore } from 'vuex';
import { nextTick } from 'vue';
import { zip } from 'lodash';

const factory = () => {
    const store = createStore({
        modules: {
            search
        }
    });
    const wrapper = mount(SearchResults, {
        global: {
            plugins: [PrimeVue, store]
        }
    });
    return { store, wrapper };
}

describe('SearchResults', () => {
    test('Checks if the component got mounted', async () => {
        const { store, wrapper } = factory();
        expect(wrapper.find('[data-test="search_results_div"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="search_results_found"]').exists()).toBe(false)
        expect(wrapper.find('[data-test="search_results_blank"]').exists()).toBe(true)
        // let's also check that the segmentedWords map in the state is blank
        expect(store.state.search.segmentedWords.size).toEqual(0);
    });
    test('Checks if segmentedWords are shown', async () => {
        const { store, wrapper } = factory();
        expect(wrapper.find('[data-test="search_results_div"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="search_results_found"]').exists()).toBe(false)
        expect(wrapper.find('[data-test="search_results_blank"]').exists()).toBe(true)
        // let's also check that the searchString in the search module state is null 
        const segmentedWordsArray = ["我们", "是", "你们", "的", "朋友"];
        segmentedWordsArray.forEach((word, index) => {
            store.state.search.segmentedWords.set(index, word);
        })
        await nextTick();
        expect(wrapper.find('[data-test="search_results_div"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="search_results_found"]').exists()).toBe(true)
        expect(wrapper.find('[data-test="search_results_blank"]').exists()).toBe(false)
        // let's see if we can see the 5 <p></p> items
        const pElements = wrapper.findAll('p')
        // now let's iterate over each pElement and each word in segmentedWordsArray
        // let's zip them together...yes Python I know
        const pElsAndWords = zip(pElements, segmentedWordsArray);
        pElsAndWords.forEach((pElementAndWord, _) => {
            const pElement = pElementAndWord[0];
            const word = pElementAndWord[1];
            // now check the text in each one and compare with the word in the array
            expect(pElement.text()).toEqual(word);
        })
    });
});




