<template>
  <div class="history">
    <h1>This is your search history page.</h1>
    <div v-if="searchHistory.size > 0">
      <div v-for="word of searchHistory.keys()" :key="word">
        <router-link :to="{ name: 'wordDetail', params: { simplified: word } }">
          <p>{{ word }}: {{ searchHistory.get(word) }}</p>
        </router-link>
      </div>
    </div>
    <div v-else>
      <h4>It's empty. Go study!</h4>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("search", ["searchHistory"])
  }
};
</script>
