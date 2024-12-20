<script setup>

import {onMounted, ref} from "vue";
import api from "@/config/axios.js";
import PersonalKpiTable from "@/components/common/PersonalKpiTable.vue";
import router from "@/router/router.js";
import {useAuthStore} from "@/store/authStore.js";

const KPIs = ref([]);
const KPILists = ref([]);
const authStore = useAuthStore();

// 사원 목록 조회
const fetchEmpList = async (page) => {

  const empId = authStore.empId;

  const response = (await api.get(`/perfomances/kpi/personal/${empId}`)).data;
  KPIs.value = response.kpiLists;
  KPILists.value = response;
}

// 라우팅 시 사용
const goTo = (url) => {
  router.push(url);
}

// KPI 제출까지 남은 일자
const day = ref({
  expiredays: calculateDaysLeft(), // 현재 일로부터 당해 마지막 날까지 남은 날짜 계산
});

// 올해 마지막날 까지 남은 날짜 계산
function calculateDaysLeft() {
  const today = new Date();
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31); // 12월 31일
  const timeDifference = lastDayOfYear - today;
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
}

onMounted(() => {
  fetchEmpList(1);
});

</script>

<template>
  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">개인 KPI</p>
      <p id="expiredays">개인 KPI 제출 기한이 {{day.expiredays}}일 남았습니다.</p>

    </div>
  </div>

  <!-- 표 사용 -->
  <div id="empList-div">
    <p id="kpiswarn">반드시 {{KPILists.minKpis}}개 이상의 KPI를 작성해야 합니다.</p>
    <p id="total">{{KPILists.totalKpis}}/{{KPILists.maxKpis}}개</p>
    <PersonalKpiTable :row-key="'id'" :rows="KPIs"/>
  </div>
</template>

<style scoped>

#empList-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  gap: 10px; /* 각 요소 간의 간격 */
  margin: 0 auto; /* 수평 중앙 정렬 */
}

#title {
  font-size: 35px;
  font-weight: bold;
  color: #3C4651;
}

#expiredays {
  font-size: 20px;
  color: #afa9a9;
}

#header-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-top: 50px;
}
#header-top, #header-bottom {
  margin-top: 20px;
  width: 900px;
}
#total {
  margin: 0;
  padding: 0;
  font-weight: bold;
  color: #3c4651;
  width: 800px;
  text-align: right;
}

#kpiswarn{
  margin: 0;
  padding: 0;
  color: #3c4651;
  width: 900px;
  text-align: right;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>