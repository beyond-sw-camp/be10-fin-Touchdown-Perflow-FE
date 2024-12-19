<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/config/axios.js";
import TableBasic from "@/components/common/TableBasic.vue";

// 상태 관리
const weeklyData = ref([]);
const monthlyData = ref([]);
const filteredData = ref([]);
const formattedData = ref([]);
const weeks = ref([]);
const months = ref([]);
const selectedWeek = ref(null);
const selectedMonth = ref(null);
const viewMode = ref("weekly"); // "weekly" 또는 "monthly"

// 월 이름과 숫자 매핑
const monthMap = {
  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
};

// 주차별 데이터 호출
const fetchWeeklyAttendance = async () => {
  try {
    const response = await api.get("/hr/attendance/summaries/weekly");
    weeklyData.value = response.data;

    // 주차 데이터 추출
    const weeklyPeriods = response.data.map((item) => parseInt(item.period));
    weeks.value = [...new Set(weeklyPeriods)].sort((a, b) => b - a);
    selectedWeek.value = weeks.value[0];

    // 초기 데이터 설정
    if (viewMode.value === "weekly") {
      filterByWeek(selectedWeek.value);
    }
  } catch (error) {
    console.error("주차별 데이터 호출 실패:", error.response?.data || error.message);
  }
};

// 월별 데이터 호출
const fetchMonthlyAttendance = async () => {
  try {
    const response = await api.get("/hr/attendance/summaries/monthly");
    monthlyData.value = response.data;

    // 월 데이터를 숫자로 매핑 후 내림차순 정렬
    const monthlyPeriods = response.data
        .map((item) => monthMap[item.period])
        .filter((item) => item !== undefined); // 잘못된 월 이름 필터링
    months.value = [...new Set(monthlyPeriods)].sort((a, b) => b - a); // 내림차순
    selectedMonth.value = months.value[0];

    // 초기 데이터 설정
    if (viewMode.value === "monthly") {
      filterByMonth(selectedMonth.value);
    }
  } catch (error) {
    console.error("월별 데이터 호출 실패:", error.response?.data || error.message);
  }
};

// 주차별 필터링
const filterByWeek = (week) => {
  filteredData.value = weeklyData.value.filter(
      (item) => parseInt(item.period) === week
  );
};

// 월별 필터링
const filterByMonth = (month) => {
  filteredData.value = monthlyData.value.filter(
      (item) => monthMap[item.period] === month
  );
};

// 근무 시간 포맷
const formatWorkTime = (hours, minutes) => {
  if (hours === undefined || minutes === undefined) return "미등록";
  if (hours < 0) return "미등록";
  return `${hours}시간 ${minutes}분`;
};

// 테이블 컬럼 (이름과 근무 시간만 표시)
const columns = [
  { field: "empName", label: "이름" },
  { field: "workTime", label: "근무 시간" },
];

// 필터링된 데이터를 포맷
const updateFormattedData = () => {
  formattedData.value = filteredData.value.map((item) => ({
    ...item,
    workTime: formatWorkTime(item.totalHours, item.totalMinutes),
  }));
};

// 필터링된 데이터가 변경될 때마다 업데이트
watch(filteredData, updateFormattedData, { immediate: true });

// 컴포넌트 마운트 시 데이터 호출
onMounted(() => {
  fetchWeeklyAttendance();
  fetchMonthlyAttendance();
});
</script>





<template>
  <div class="table-container">
    <div class="header">
      <h1>근무 현황</h1>
      <div class="filter-section">
        <!-- 보기 전환 버튼 -->
        <button
            :class="{ active: viewMode === 'weekly' }"
            @click="viewMode = 'weekly'; filterByWeek(selectedWeek)"
        >
          주차별 보기
        </button>
        <button
            :class="{ active: viewMode === 'monthly' }"
            @click="viewMode = 'monthly'; filterByMonth(selectedMonth)"
        >
          월별 보기
        </button>

        <!-- 주차 필터 -->
        <div v-if="viewMode === 'weekly'" class="filter-section">
          <label>주차</label>
          <select v-model="selectedWeek" @change="filterByWeek(selectedWeek)">
            <option v-for="week in weeks" :key="week" :value="week">
              {{ week }}주차
            </option>
          </select>
        </div>

        <!-- 월별 필터 -->
        <div v-if="viewMode === 'monthly'" class="filter-section">
          <label>월</label>
          <select v-model="selectedMonth" @change="filterByMonth(selectedMonth)">
            <option v-for="month in months" :key="month" :value="month">
              {{ month }}월
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <TableBasic :row-key="'empName'" :rows="formattedData" :columns="columns" />
    </div>
  </div>
</template>




<style scoped>
table{
  width: 100%;
  table-layout: auto;
  border-collapse: collapse;
}
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

button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
}

button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
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

th,
td {
  text-align: center;
  vertical-align: middle;
  font-size: 15px;
}

.table-wrapper {
  display: flex;
  justify-content: center;
  text-align: center;

}
</style>
