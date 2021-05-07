<template>
  <div data-test="searchResultsDiv" class="search_results">
    <div
     data-test="searchResultsFound"
     v-if="currentWords.size>0"
     class="container p-grid p-flex-column"
     >
        <p v-for="word of currentWords" :key="word">{{ word }}</p>
    </div>
    <div data-test="searchResultsBlank" v-else>
        <p>Enter some text to get started.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('search', ['currentWords']),
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
