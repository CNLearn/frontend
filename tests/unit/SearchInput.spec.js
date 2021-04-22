import { mount } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput.vue';
import PrimeVue from 'primevue/config';


describe('SearchInput', () => {
  test('Checks if the component got mounted', async () => {
    const wrapper = mount(SearchInput, {
      global: {
        plugins: [PrimeVue]
      }
    });
    expect(wrapper.find('[data-test="searched_for"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="search_box"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="search_string"]').exists()).toBe(false)
  });
  test('Checks if inputting values works', async () => {
    const wrapper = mount(SearchInput, {
      global: {
        plugins: [PrimeVue]
      }
    });
    // set the searchString data using setData method
    await wrapper.setData({ searchString: "hello" })
    expect(wrapper.find('[data-test="search_string"]').exists()).toBe(true)
    const search_string = wrapper.find('[data-test="search_string"]').element.textContent
    expect(search_string).toBe("hello")

    // let's also "write some text" in the textfield using setValue
    await wrapper.find('[data-test="search_box"]').setValue("general")
    const updated_search_string = wrapper.find('[data-test="search_string"]').element.textContent
    expect(updated_search_string).toBe("general")
  });
});
