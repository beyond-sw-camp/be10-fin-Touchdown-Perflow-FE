<script setup>

import {useStore} from "@/store/store.js";
import {ref} from "vue";

const store = useStore();

const props = defineProps({
  context: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(["update:selectedApprovalEmployees", "update:selectedShareEmployees"]); // 부모 컴포넌트로 이벤트 전달
const selectedEmployees = ref([]); // 선택된 사원 목록

const handleCheckboxChange = (employee, event) => {
  console.log(`[OrganizationSelectedEmp] handleCheckboxChange 호출됨. 사원: ${employee.name}, 체크 상태: ${event.target.checked}`);
  if (event.target.checked) {
    selectedEmployees.value.push(employee); // 체크 시 추가
  } else {
    selectedEmployees.value = selectedEmployees.value.filter(
        (e) => e.empId !== employee.empId
    ); // 체크 해제 시 삭제
  }

  console.log(`[OrganizationSelectedEmp] 현재 selectedEmployees 목록:`, selectedEmployees.value);

  if (props.context === "approval") {
    console.log(`[OrganizationSelectedEmp] 결재선 설정 이벤트 emit`);
    emit("update:selectedApprovalEmployees", selectedEmployees.value);
  } else if (props.context === "share") {
    console.log(`[OrganizationSelectedEmp] 공유 설정 이벤트 emit`);
    emit("update:selectedShareEmployees", selectedEmployees.value);
  }

  // emit("update:selectedApprovalEmployees", selectedEmployees.value); // 부모로 이벤트 전달
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