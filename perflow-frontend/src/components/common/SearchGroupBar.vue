<script setup>
import Datepicker from 'vue3-datepicker';

const props = defineProps({
  modelValue: {
    type: [String, Date],
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

const updateValue = (value) => {
  emit("update:modelValue", value); // 부모 컴포넌트로 값 전달
};
</script>

<template>
  <div class="search-group-bar">
    <!-- 텍스트 입력 필드 -->
    <input
        v-if="type === 'text'"
        :type="type"
        :value="modelValue"
        @input="updateValue($event.target.value)"
        :placeholder="placeholder"
        class="search-input"
    />
    <!-- 날짜 선택 필드 -->
    <Datepicker
        v-else
        :model-value="modelValue"
        @update:model-value="updateValue"
        :placeholder="placeholder"
        :format="'YYYY-MM-DD'"
        :clearable="true"
        :masks="{ input: 'YYYY-MM-DD' }"
        class="datepicker"
    />
  </div>
</template>

<style scoped>
.search-group-bar {
  display: inline-block;
  margin-right: 10px;
}

.search-input,
.datepicker {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
</style>
