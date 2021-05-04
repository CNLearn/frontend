<template>
  <div data-test="search_results_div" class="search_results">
    <div data-test="search_results_found" v-if="segmentedWords.size>0" class="container p-grid p-flex-column">
        <p v-for="word of segmentedWords.values()" :key="word">{{ word }}</p>
    </div>
    <div data-test="search_results_blank" v-else>
        <p>Enter some text to get started.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('search', ['segmentedWords']),
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
