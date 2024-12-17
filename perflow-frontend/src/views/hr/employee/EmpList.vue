<script setup>

import {onMounted, ref} from "vue";
import api from "@/config/axios.js";
import TableBasic from "@/components/common/TableBasic.vue";

const employees = ref([]);

const fetchEmpList = async (page) => {
  employees.value = (await api.get("/employees/lists", {
    params: {
      page: page
    }
  })).data;
}
const columns = [
  { field: 'empId',    label: '사번'  },
  { field: 'position', label: '직급'  },
  { field: 'job',      label: '직책'  },
  { field: 'name',     label: '이름'  },
];
onMounted(() => {
  fetchEmpList(1);
});
</script>

<template>
  <div id="empList-div">
    <TableBasic :row-key="'id'" :rows="employees" :columns="columns" />
  </div>
</template>

<style scoped>
#empList-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  gap: 20px; /* 각 요소 간의 간격 */
  margin: 0 auto; /* 수평 중앙 정렬 */
  padding-top: 200px;
}
</style>