<template>
  <div class="container">
    <div id="stroke_diagram" ref="stroke_diagram"></div>
    <br />
    <Button
      icon="pi pi-play"
      label="Animate"
      class="p-button-outlined p-ripple"
      @click="animateButton"
    />
  </div>
</template>

<script>
import Button from "primevue/button";

import HanziWriter from "hanzi-writer";

export default {
  props: {
    character: {
      type: String,
      required: true
    }
  },
  components: {
    Button
  },
  mounted() {
    this.stroke_diagram = HanziWriter.create(this.$refs.stroke_diagram, this.character, {
      width: 150,
      height: 150,
      padding: 5,
      // radicalColor: '#168F16',
      strokeAnimationSpeed: 0.75,
      delayBetweenStrokes: 50,
      delayBetweenLoops: 2000
    });
  },
  methods: {
    animateButton() {
      this.stroke_diagram.animateCharacter();
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.animateButton {
  font-size: 1em;
  border-radius: 10px;
  background-color: aquamarine;
  border-color: none;
  border-width: 0px;
}
</style>
