<template>
  <div class="kpi-container">
    <!-- 제목 -->
    <div id="header-div" class="header-container">
      <!-- 드롭다운 컴포넌트 -->
      <ButtonDropDown
          :options="dropdownOptions"
          :width="'90px'"
          :height="'40px'"
          :fontSize="'16px'"
          :imgSize="'20px'"
          :marginLeft="'7px'"
          @select="handleDropdownChange"
      />
    </div>
    <!-- 선택된 KPI 정보 표시 -->
    <div id="header-div" class="header-container">
      <h1 v-if="isYearSelected" class="header-title">{{ selectedYear }}년</h1>
      <h1 v-if="isQuarterSelected" class="header-title">{{ selectedQuarter }}분기</h1>
      <h1 v-if="isMonthSelected" class="header-title">{{ selectedMonth }}월</h1>
      <h1 class="header-title"> 나의 KPI</h1>
    </div>

    <!-- 개인 KPI 섹션 -->
    <section>
      <h2 class="kpi-personal">개인</h2>
      <KpiSection :kpiData="personalKPIs" @update-kpi="handleUpdateKpi" @refresh-kpi-data="refreshKpiData" />
    </section>

    <!-- 팀 KPI 섹션 -->
    <section>
      <h2 class="kpi-team">팀</h2>
      <KpiSection :kpiData="teamKPIs" @update-kpi="handleUpdateKpi" @refresh-kpi-data="refreshKpiData" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import KpiSection from "@/components/common/KpiSection.vue";
import ButtonDropDown from "@/components/common/ButtonDropDown.vue";
import api from "@/config/axios.js";
import { useAuthStore } from "@/store/authStore.js";

const authStore = useAuthStore();
const empId = authStore.empId;

// 드롭다운 옵션 데이터
const dropdownOptions = [
  { label: "년" },
  { label: "분기" },
  { label: "월" },
]

// 선택된 값들
const selectedOption = ref("")
const selectedYear = ref(null)
const selectedQuarter = ref(null)
const selectedMonth = ref(null)

// 선택된 항목 여부
const isYearSelected = computed(() => selectedYear.value !== null)
const isQuarterSelected = computed(() => selectedQuarter.value !== null)
const isMonthSelected = computed(() => selectedMonth.value !== null)

// KPI 데이터
const personalKPIs = ref([])
const teamKPIs = ref([])

const refreshKpiData = () => {
  // 개인 및 팀 KPI 데이터를 다시 가져오기
  fetchPersonalKpiList(empId);
  fetchTeamKpiList(empId);
};


// 드롭다운에서 선택된 값에 따라 현재 시각 설정
const handleDropdownChange = (selected) => {
  const now = new Date() // 현재 시각
  selectedYear.value = now.getFullYear() // 현재 년도

  if (selected === "년") {
    selectedQuarter.value = null // 분기 초기화
    selectedMonth.value = null // 월 초기화
  } else if (selected === "분기") {
    const month = now.getMonth() + 1 // 현재 월 (0부터 시작하므로 +1)
    selectedQuarter.value = Math.ceil(month / 3) // 현재 분기 계산
    selectedMonth.value = null // 월 초기화
  } else if (selected === "월") {
    selectedMonth.value = now.getMonth() + 1 // 현재 월
    selectedQuarter.value = null // 분기 초기화
  }
}

// 개인 KPI 데이터 가져오기
const fetchPersonalKpiList = async (empId) => {
  try {
    const requestData = {
      quarter: selectedQuarter.value,
      month: selectedMonth.value,
    }
    const response = (
        await api.get(`/perfomances/kpi/personal/period/current/${empId}/${selectedYear.value}`, {
          params: requestData,
        })
    ).data
    personalKPIs.value = response.kpiLists
  } catch (error) {
    console.error("개인 KPI 데이터를 가져오는 데 실패했습니다.", error)
  }
}

// 팀 KPI 데이터 가져오기
const fetchTeamKpiList = async (empId) => {
  try {
    const requestData = {
      quarter: selectedQuarter.value,
      month: selectedMonth.value,
    }
    const response = (
        await api.get(`/perfomances/kpi/team/period/current/${empId}/${selectedYear.value}`, {
          params: requestData,
        })
    ).data
    teamKPIs.value = response.kpiLists
  } catch (error) {
    console.error("팀 KPI 데이터를 가져오는 데 실패했습니다.", error)
  }
}

// 드롭다운 값 변경 시 API 호출
watch([selectedYear, selectedQuarter, selectedMonth], () => {
  if (isYearSelected.value || isQuarterSelected.value || isMonthSelected.value) {
    fetchPersonalKpiList(empId)
    fetchTeamKpiList(empId)
  }
})

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchPersonalKpiList(empId)
  fetchTeamKpiList(empId)
})

// KPI 업데이트 처리
const handleUpdateKpi = (updatedKpi) => {
  // 개인 KPI 업데이트
  const updateKpiList = (kpiList) => {
    const index = kpiList.findIndex((kpi) => kpi.kpiId === updatedKpi.kpiId); // kpiId로 비교
    if (index !== -1) {
      kpiList[index] = { ...kpiList[index], ...updatedKpi }; // 업데이트된 데이터 반영
    }
  };

  updateKpiList(personalKPIs.value); // 개인 KPI 리스트 갱신
  updateKpiList(teamKPIs.value); // 팀 KPI 리스트 갱신
};
</script>

<style scoped>
.kpi-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

section {
  margin-bottom: 40px;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #3c4651;
}

.kpi-personal {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}

.kpi-team {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}
</style>
