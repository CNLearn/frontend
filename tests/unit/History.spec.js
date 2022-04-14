import { mount } from "@vue/test-utils";
import Search from "@/views/Search.vue";
import History from "@/views/History.vue";
import WordPage from "@/views/WordPage.vue";
import PrimeVue from "primevue/config";
import search from "@/store/modules/search";
import { createStore } from "vuex";
import { createWebHistory, createRouter } from "vue-router";
import { zip } from "lodash";

jest.mock("@/services/Dictionary");
beforeEach(() => {
  jest.clearAllMocks();
});

const factory = async initialSearchStore => {
  const store = createStore({
    modules: {
      search
    }
  });
  const routes = [
    {
      path: "/",
      name: "search",
      component: Search
    },
    {
      path: "/words/:simplified",
      name: "wordDetail",
      component: WordPage
    }
  ];
  const router = createRouter({
    routes,
    history: createWebHistory()
  });
  // manually set the state of our search module state
  store.state.search = initialSearchStore;
  const wrapper = mount(History, {
    global: {
      plugins: [PrimeVue, store, router]
    }
  });

  return { store, wrapper, router };
};

describe("History view tests", () => {
  test("Checks if the view component got mounted and tells us to study", async () => {
    const initialSearchStore = {
      searchString: "",
      segmentedWords: new Map(),
      cachedWords: new Map(),
      currentWords: new Set(),
      searchHistory: new Map()
    };
    const { store, wrapper, router } = await factory(initialSearchStore);
    await router.isReady();
    // test the header
    const h1 = wrapper.find("h1");
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe("This is your search history page.");
    const h4 = wrapper.find("h4");
    expect(h4.exists()).toBe(true);
    expect(h4.text()).toBe("It's empty. Go study!");
  });
  test("Checks if the words from searchHistory appear as links", async () => {
    const wordsHistory = [
      ["我们", 1],
      ["说", 3],
      ["再见", 5]
    ];
    const initialSearchStore = {
      searchString: "",
      segmentedWords: new Map(),
      cachedWords: new Map(),
      currentWords: new Set(),
      searchHistory: new Map(wordsHistory)
    };
    const { store, wrapper, router } = await factory(initialSearchStore);
    await router.isReady();
    // test the header
    const h1 = wrapper.find("h1");
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe("This is your search history page.");

    // let's check through the history
    const characterHistoryP = wrapper.findAll("p");
    const characterHistoryPAndHistory = zip(characterHistoryP, wordsHistory);
    characterHistoryPAndHistory.forEach(([histP, [simplified, histCount]]) => {
      expect(histP.text()).toEqual(`${simplified}: ${histCount}`);
    });
  });
});
