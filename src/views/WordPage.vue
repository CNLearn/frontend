<template>
  <div class="container">
    <div v-if="this.loading">
      <Skeleton width="20rem" height="10rem"></Skeleton>
    </div>
    <div v-else-if="this.word === undefined">
      <p>
        No such word exists.
        Please go back to the
        <router-link :to="{ name: 'search' }">
        search page
        </router-link>
        and check if any words were found.
      </p>
    </div>
    <div v-else>
      <div v-for="option in word" :key="option.id">
        <h2>{{ option.simplified }} {{ option.pinyin_accent }}</h2>
        <div id="definitions">
          <h3>Definitions</h3>

          <ol class="definitions">
            <li
              v-for="(definition, index) in option.definitions.split(';')"
              :key="index"
            >
              {{ definition }}
            </li>
          </ol>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Skeleton from 'primevue/skeleton';
import { extractChineseCharactersToString } from '@/utilities/chinese';

export default {
  components: {
    Skeleton,
  },
  data() {
    return {
      simplified: '',
      loading: false,
      word: null,
      error: null,
      characters: new Set(),
    };
  },
  async created() {
    this.loading = true;
    const unprocessedSimplified = this.$route.params.simplified;
    this.simplified = extractChineseCharactersToString(unprocessedSimplified);
    if (this.simplified !== '' && !this.getWord(this.simplified)) {
      await this.findWords([this.simplified]);
    }
    this.word = this.getWord(this.simplified);
    [...this.simplified].forEach((c) => this.characters.add(c));
    this.loading = false;
  },
  methods: {
    ...mapActions('search', ['findWords']),
  },
  computed: {
    ...mapGetters('search', ['getWord']),
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
