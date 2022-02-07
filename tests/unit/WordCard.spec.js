import { mount } from "@vue/test-utils";
import WordCard from "@/components/WordCard.vue";
import PrimeVue from "primevue/config";
import search from "@/store/modules/search";
import { createStore } from "vuex";
import { zip } from "lodash";

const wordObject = {
  word: "好",
  pinyin: "hǎo",
  definitions: ["good", "well"]
};

const factory = () => {
  const store = createStore({
    modules: {
      search
    }
  });
  const wrapper = mount(WordCard, {
    props: wordObject,
    global: {
      plugins: [PrimeVue, store]
    }
  });
  return { store, wrapper };
};

describe("WordCard", () => {
  test("Checks if the component got mounted", () => {
    const { wrapper } = factory();
    expect(wrapper.find(".p-card-title").exists()).toBe(true);
    expect(wrapper.find(".p-card-title").text()).toBe("好");
    expect(wrapper.find(".p-card-subtitle").exists()).toBe(true);
    expect(wrapper.find(".p-card-subtitle").text()).toBe("hǎo");
    expect(wrapper.find(".p-card-content").exists()).toBe(true);
    const definitionElements = wrapper.findAll(".individualDefinition");
    const { definitions } = wordObject;
    const defElementsAndDefinitions = zip(definitionElements, definitions);
    defElementsAndDefinitions.forEach(([defElement, definition]) => {
      expect(defElement.text()).toEqual(definition);
    });
  });
});
