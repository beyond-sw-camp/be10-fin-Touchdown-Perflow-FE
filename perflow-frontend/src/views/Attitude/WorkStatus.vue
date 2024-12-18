<template>
  <div class="work-time-container">
    <!-- 상단 타이틀과 필터 -->
    <div class="header">
      <h1>근무 현황</h1>
      <div class="filter-section">
        <!-- 주차 선택 드롭다운 -->
        <label>기간</label>
        <select v-model="selectedWeek" @change="fetchAttendanceData">
          <option v-for="week in weeks" :key="week" :value="week">
            {{ week }}주차
          </option>
        </select>
      </div>
    </div>

    <!-- 근무 현황 테이블 -->
    <div class="table-container">
      <table>
        <thead>
        <tr>
          <th>이름</th>
          <th>부서</th>
          <th>근무 시간</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(record, index) in attendanceData" :key="index">
          <td>{{ record.name }}</td>
          <td>{{ record.department }}</td>
          <td>{{ record.workTime }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/axios.js";

// 드롭다운 주차 데이터
const weeks = ref([1, 2, 3, 4, 5]); // 예제 주차 데이터
const selectedWeek = ref(1); // 초기 선택값

// 근무 시간 데이터
const attendanceData = ref([]);

// 근무 시간 데이터 조회 함수
const fetchAttendanceData = async () => {
  try {
    const response = await api.get(`/api/v1/emp/attendance/summaries/weekly`, {
      params: { week: selectedWeek.value },
    });
    attendanceData.value = response.data; // API 응답을 테이블에 바인딩
  } catch (error) {
    console.error("데이터 조회 실패", error);
  }
};

onMounted(() => {
  fetchAttendanceData(); // 컴포넌트 마운트 시 초기 데이터 조회
});
</script>

<style scoped>
.work-time-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-section label {
  font-weight: bold;
}

.filter-section select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}
</style>
