<template>
  <label v-if="inputLabel"> {{ inputLabel }}</label>
  <input
    v-bind="$attrs"
    :placeholder="inputLabel"
    :value="modelValue"
    :type="inputType"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    inputLabel: {
      type: String,
      default: ""
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    inputType: {
      type: String,
      default: "text"
    }
  }
};
</script>
