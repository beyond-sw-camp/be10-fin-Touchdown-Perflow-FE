<script setup>
import { defineProps } from "vue";
import ButtonBasic from "@/components/common/ButtonBasic.vue";

const props = defineProps({
  selectedEmployees: { type: Array, default: () => [] }, // 선택된 사원 목록
});

const emit = defineEmits(["addApproval"]); // 부모로 데이터 전달 이벤트

const handleClick = (type) => {
  emit(
      "addApproval",
      props.selectedEmployees.map((emp) => ({
        type,
        name: emp.name,
        position: emp.position,
      }))
  );
};
</script>

<template>
  <div class="button-group">
    <ButtonBasic
        label="결재"
        color="white"
        size="medium"
        @click="handleClick('결재')"
    />
    <ButtonBasic
        label="참조"
        color="white"
        size="medium"
        @click="handleClick('참조')"
    />
    <ButtonBasic
        label="합의"
        color="white"
        size="medium"
        @click="handleClick('합의')"
    />
    <ButtonBasic
        label="병렬 합의"
        color="white"
        size="medium"
        @click="handleClick('병렬 합의')"
    />
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  flex-direction: column; /* 버튼을 세로로 나열 */
  gap: 0; /* 버튼 간격 */
  justify-content: flex-start; /* 상단 정렬 */
  align-items: center; /* 버튼을 중앙 정렬 */
}
button {
  margin: 0;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}
button:hover {
  background-color: #e0e0e0;
}
</style>
