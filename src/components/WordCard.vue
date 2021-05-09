<template>
  <div class="p-col">
    <Card class="word-card box" style="width: 25rem; margin-bottom: 2em">
      <template #title> {{ word }} </template>
      <template #subtitle> {{ pinyin }}</template>
      <template #content>
          <ol class="definitionsList">
              <li class="individualDefinition"
                v-for="(definition, index) in definitions"
                :key="index"
              >
                {{ definition }}
              </li>
          </ol>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card';

export default {
  props: {
    word: String,
    pinyin: String,
    definitions: Array[String],
  },
  components: {
    Card,
  },
  computed: {},
};
</script>

<style>
.word-card {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: 1s;
}

.word-card a:link,
a:visited {
  color: dimgray;
  text-decoration: none;
}

.word-card:hover {
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: rgba(93, 238, 117, 0.5);
}

.definitionsList {
  list-style-position: outside;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
