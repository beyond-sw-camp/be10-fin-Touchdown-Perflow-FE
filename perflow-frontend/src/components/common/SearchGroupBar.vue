<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "검색어를 입력하세요",
  },
  type: {
    type: String,
    default: "text", // 'text' 또는 'date'
  },
});
const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="search-group-bar">
    <input
        :type="type"
        :value="modelValue"
        @input="updateValue"
        :placeholder="placeholder"
        class="search-input"
    />
  </div>

</template>

<style scoped>
.search-group-bar {
  display: inline-block;
  margin-right: 10px;
}

.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
</style>