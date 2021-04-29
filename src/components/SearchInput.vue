<template>
  <div>
    <p data-test="searched_for">You searched for:</p>
    <p data-test="search_string" v-if="searchString.length > 0">
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
        data-test="search_box"
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
      this.setSearch(this.localSearchString);
    },
  },
  computed: {
    ...mapState('search', ['searchString']),
  },
  methods: {
    ...mapActions('search', ['setSearch']),
  },
};
</script>

<style>
</style>
