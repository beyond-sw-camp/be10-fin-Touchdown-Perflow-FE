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
  width: {
    type: String,
    default: "200px", // 기본 너비, 부모에서 조정 가능
  },
  height: {
    type: String,
    default: "40px", // 기본 높이, 부모에서 조정 가능
  },
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value) => {
  emit("update:modelValue", value); // 부모 컴포넌트로 값 전달
};
</script>

<template>
  <div class="search-group-bar" :style="{ width: width, height: height }">
    <!-- 텍스트 입력 필드 -->
    <div class="search-container" v-if="type === 'text'">
      <input
          :type="type"
          :value="modelValue"
          @input="updateValue($event.target.value)"
          :placeholder="placeholder"
          class="search-input"
      />
    </div>
    <!-- 날짜 선택 필드 -->
    <div class="search-container" v-else>
      <Datepicker
          :model-value="modelValue"
          @update:model-value="updateValue"
          :placeholder="placeholder"
          :format="'YYYY-MM-DD'"
          :clearable="true"
          :masks="{ input: 'YYYY-MM-DD' }"
          class="datepicker"
      />
    </div>
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
