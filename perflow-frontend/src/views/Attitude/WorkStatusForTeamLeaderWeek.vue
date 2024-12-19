<script setup>
import {ref, onMounted, watch} from "vue";
import api from "@/config/axios.js";
import TableBasic from "@/components/common/TableBasic.vue";

const attendanceData = ref([]);
const filteredData = ref([]);
const formattedData = ref([]);
const weeks = ref([]);
const selectedWeek = ref(null);

const fetchAttendanceData = async () => {
  try {
    const response = await api.get("/hr/attendance/summaries/weekly");
    attendanceData.value = response.data;

    const periods = response.data.map((item) => parseInt(item.period));
    weeks.value = [...new Set(periods)].sort((a, b) => b - a);
    selectedWeek.value = weeks.value[0];
    filterByWeek(selectedWeek.value);
  } catch (error) {
    console.error("API 호출 실패:", error);
    alert("데이터를 불러오지 못했습니다.");
  }
};

const filterByWeek = (week) => {
  filteredData.value = attendanceData.value.filter(
      (item) => parseInt(item.period) === week
  );
};

const formatWorkTime = (hours, minutes) => {
  if (hours === undefined || minutes === undefined) return "미등록";
  if (hours < 0) return "미등록";
  return `${hours}시간 ${minutes}분`;
};

const columns = [
  {field: "empName", label: "이름"},
  {field: "period", label: "주차"},
  {field: "workTime", label: "근무 시간"},
];

const updateFormattedData = () => {
  formattedData.value = filteredData.value.map((item) => ({
    ...item,
    workTime: formatWorkTime(item.totalHours, item.totalMinutes),
  }));
};

watch(filteredData, updateFormattedData, {immediate: true});

onMounted(() => {
  fetchAttendanceData();
});
</script>

<template>
  <div class="table-container">
    <div class="header">
      <h1>근무 현황</h1>
      <div class="filter-section">
        <label>기간</label>
        <select v-model="selectedWeek" @change="filterByWeek(selectedWeek)">
          <option v-for="week in weeks" :key="week" :value="week">
            {{ week }}주차
          </option>
        </select>
      </div>
    </div>
    <div class="table-wrapper">
      <TableBasic :row-key="'empName'" :rows="formattedData" :columns="columns"/>
    </div>
  </div>
</template>

<style scoped>

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.table-container {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  overflow-x: auto;
}

th, td {
  text-align: center; /* 텍스트 가운데w 정렬 */
  vertical-align: middle; /* 세로 가운데 정렬 */
  font-size: 15px;
}

.table-wrapper {
  width: 90%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-content: center;
}
</style>