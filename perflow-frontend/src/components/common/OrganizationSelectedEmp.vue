<script setup>

import {useStore} from "@/store/store.js";

const store = useStore()

</script>

<template>
  <div>
    <!-- 현재 선택한 부서의 사원 -->
    <ul class="emp-list">
      <li v-for="employee in store.$state.currentEmployees" :key="employee.empId" class="emp-item">
        <input type="checkbox" class="emp-checkbox" />
        {{employee.name}} ({{employee.position}})
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