<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/axios.js";

const attendanceData = ref([]); // 전체 근무 데이터
const filteredData = ref([]); // 선택된 주차의 데이터
const weeks = ref([]); // 주차 리스트
const selectedWeek = ref(null); // 선택된 주차

// API 요청 함수
const fetchAttendanceData = async () => {
  try {
    const response = await api.get("/leader/attendance/summaries/weekly");
    console.log(response.data);

    attendanceData.value = response.data;

    // period 값 추출 및 내림차순 정렬
    const periods = response.data.map((item) => parseInt(item.period));
    const uniquePeriods = [...new Set(periods)];
    weeks.value = uniquePeriods.sort((a, b) => b - a); // 내림차순 정렬

    // 기본 선택값: 가장 큰 주차
    selectedWeek.value = weeks.value[0];
    filterByWeek(selectedWeek.value); // 초기 데이터 필터링
  } catch (error) {
    console.error("API 호출 실패:", error);
    alert("데이터를 불러오지 못했습니다.");
  }
};

// 주차별 데이터 필터링
const filterByWeek = (week) => {
  filteredData.value = attendanceData.value.filter(
      (item) => parseInt(item.period) === week
  );
};

onMounted(() => {
  fetchAttendanceData();
});

const formatWorkTime = (hours, minutes) => {
  if (hours === undefined || minutes === undefined) return "미등록";
  if (hours < 0) return "미등록"; // 음수 시간일 경우
  return `${hours}시간 ${minutes}분`;
};

</script>


<template>
  <div class="table-container">
    <div class="header">
      <h1>근무 현황</h1>
      <div class="filter-section">
        <!-- 주차 선택 드롭다운 -->
        <label>기간</label>
        <select v-model="selectedWeek" @change="filterByWeek(selectedWeek)">
          <option v-for="week in weeks" :key="week" :value="week">
            {{ week }}주차
          </option>
        </select>
      </div>
    </div>

    <table>
      <thead>
      <tr>
        <th>이름</th>
        <th>주차</th>
        <th>근무 시간</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(record, index) in filteredData" :key="index">
        <td>{{ record.empName }}</td>
        <td>{{ record.period }}</td>
        <td>{{ formatWorkTime(record.totalHours, record.totalMinutes) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>




<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 10px; /* 라벨과 드롭다운 사이 여백 */
}

h1 {
  margin: 0; /* 기본 마진 제거 */
  font-size: 24px; /* 글자 크기 조절 */
  font-weight: bold;
}

.table-container {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}

th, td {
  border: none;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

/*tr:nth-child(even) {
  background-color: #f9f9f9;
}*/

table tr:first-child th:first-child {
  border-top-left-radius: 10px; /* 좌상단 모서리 둥글게 */
}

table tr:first-child th:last-child {
  border-top-right-radius: 10px; /* 우상단 모서리 둥글게 */
}

table tr:last-child td:first-child {
  border-bottom-left-radius: 10px; /* 좌하단 모서리 둥글게 */
}

table tr:last-child td:last-child {
  border-bottom-right-radius: 10px; /* 우하단 모서리 둥글게 */
}

tr:hover {
  background-color: #f1f1f1;
}
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#container-header, .container-item {
  width: 900px;
  margin-top: 20px;
}

</style>
