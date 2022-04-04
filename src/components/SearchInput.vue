<template>
  <div class="search_box_div">
    <p data-test="searchedFor">You searched for:</p>
    <p data-test="searchString" v-if="searchString.length > 0">
      {{ searchString }}
    </p>
    <span class="p-input-icon-left">
      <i class="pi pi-search" />
      <InputText
        type="text"
        class="search_box"
        id="search_box"
        v-model="localString"
        placeholder="Search"
        data-test="searchBox"
      />
    </span>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import { mapState, mapActions } from "vuex";
import { debounce } from "lodash";

export default {
  name: "SearchInput",
  props: {},
  components: {
    InputText
  },
  data() {
    return {
      localString: ""
    };
  },
  watch: {
    localString(newValue) {
      this.debSearch(newValue);
    }
  },
  created() {
    this.debSearch = debounce(this.search, 500);
  },
  computed: {
    ...mapState("search", ["searchString"])
  },
  methods: {
    ...mapActions("search", ["search"])
  },
  beforeUnmount() {
    this.debSearch.cancel();
  }
};
</script>

<style>
.search_box_div {
  margin-bottom: 2em;
}
</style>
