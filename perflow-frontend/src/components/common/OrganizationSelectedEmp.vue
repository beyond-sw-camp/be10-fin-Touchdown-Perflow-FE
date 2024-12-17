<script setup>

import {useStore} from "@/store/store.js";
import {ref} from "vue";

const store = useStore();
const emit = defineEmits(["update:selectedEmployees"]); // 부모 컴포넌트로 이벤트 전달
const selectedEmployees = ref([]); // 선택된 사원 목록

const handleCheckboxChange = (employee, event) => {
  if (event.target.checked) {
    selectedEmployees.value.push(employee); // 체크 시 추가
  } else {
    selectedEmployees.value = selectedEmployees.value.filter(
        (e) => e.empId !== employee.empId
    ); // 체크 해제 시 삭제
  }
  emit("update:selectedEmployees", selectedEmployees.value); // 부모로 이벤트 전달
};
</script>

<template>
  <div>
    <!-- 현재 선택한 부서의 사원 -->
    <ul class="emp-list">
      <li
          v-for="employee in store.$state.currentEmployees"
          :key="employee.empId"
          class="emp-item"
      >
        <input
            type="checkbox"
            class="emp-checkbox"
            @change="(event) => handleCheckboxChange(employee, event)"
        />
        {{ employee.name }} ({{ employee.position }})
      </li>
    </ul>
  </div>
</template>

<style scoped>
.emp-list {
  list-style: none; /* 기본 동그라미 제거 */
  padding: 0;       /* 기본 여백 제거 */
}
.emp-item {
  display: flex;
  align-items: center;
  gap: 8px; /* 체크박스와 이름 사이 약간의 간격 */
}
.emp-checkbox {
  cursor: pointer;
}
</style>