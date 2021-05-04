<template>
  <div class="home">
    <SearchInput />

    <SearchResults />
  </div>
</template>

<script>
import SearchInput from '@/components/SearchInput.vue';
import SearchResults from '@/components/SearchResults.vue';

export default {
  components: {
    SearchInput,
    SearchResults,
  },
};
</script>

<style scoped>
</style>
