<template>
  <div>
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
        v-model="localSearchString"
        placeholder="Search"
        data-test="searchBox"
      />
    </span>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'SearchInput',
  props: {},
  components: {
    InputText,
  },
  data() {
    return {
      localSearchString: '',
    };
  },
  watch: {
    localSearchString() {
      this.search(this.localSearchString);
    },
  },
  computed: {
    ...mapState('search', ['searchString']),
  },
  methods: {
    ...mapActions('search', ['search']),
  },
};
</script>

<style>
</style>
