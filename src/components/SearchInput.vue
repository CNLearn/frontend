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
        v-model="searchString"
        placeholder="Search"
        data-test="search_box"
      />
    </span>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';

export default {
  name: 'SearchInput',
  props: {},
  components: {
    InputText,
  },
  data() {
    return {
      searchString: '',
    };
  },
};
</script>

<style>
</style>
