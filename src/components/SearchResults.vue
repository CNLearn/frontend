<template>
  <div data-test="searchResultsDiv" class="search_results">
    <div
     data-test="searchResultsFound"
     v-if="currentWords.size>0"
     class="container p-grid p-flex-column"
     >
      <div v-for="simplifiedWord of currentWords" :key="simplifiedWord">
        <router-link
         :to="{ name: 'wordDetail', params: { simplified: simplifiedWord } }"
         >
        <WordCard
         v-for="(wordObject, index) in getWord(simplifiedWord)"
         :key="index"
         v-bind="getWordObject(simplifiedWord, index, 2)"
        />
        </router-link>
      </div>
    </div>
    <div data-test="searchResultsBlank" v-else>
        <p>Enter some text to get started.</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import WordCard from '@/components/WordCard.vue';

export default {
  components: {
    WordCard,
  },
  methods: {
    getWordObject(simplifiedWord, pos, nDefinitions) {
      const allWords = this.getWord(simplifiedWord);
      const {
        simplified: word,
        pinyin_accent: pinyin,
        definitions: fullDefinitions,
      } = allWords[pos];
      const definitions = fullDefinitions.split(';').slice(0, nDefinitions);
      return { word, pinyin, definitions };
    },
  },
  computed: {
    ...mapState('search', ['currentWords']),
    ...mapGetters('search', ['getWord']),
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
