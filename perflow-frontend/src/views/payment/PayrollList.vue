<script setup>
import { reactive, onMounted, ref } from "vue";
import api from "@/config/axios.js";
import PagingBar from "@/components/common/PagingBar.vue";
import ExcelDropDown from "@/components/common/ExcelDropDown.vue";
import TableBasic from "@/components/common/TableBasic.vue";
import ThreeMonthChart from "@/views/payment/ThreeMonthChart.vue";

const threeYearsByMonth = ref(null);
const threeMonths = ref(null);
const threeYears = ref(null);

const state = reactive({
  payrolls: [],
  currentPage: 1,
  totalPages: 1,
  totalItems:0,
  pageSize: 10
});

// 해당 월의 3년간 데이터 정보를 가져오는 함수
const fetchThreeYearsByMonth = async () => {
  try {
    const response = await api.get(`/hr/payrolls/chart/last-three-years-by-latest-month`);
    threeYearsByMonth.value = response.data.payrollChart;
  } catch (error) {
    console.error('해당 월의 3년간 데이터 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 3년 간 급여 데이터 정보를 가져오는 함수
const fetchThreeYears = async () => {
  try {
    const response = await api.get(`/hr/payrolls/chart/last-three-years`);
    threeYears.value = response.data.payrollYear;
  } catch (error) {
    console.error('3년 간 급여 데이터 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 급여대장 목록을 가져오는 함수
const fetchPayrolls = async (page = 1) => {
  try {
    const response = await api.get(`/hr/payrolls`, {
      params: {
        page
      }
    });
    state.payrolls = response.data.payrolls;
    state.currentPage = response.data.currentPage;
    state.totalPages = response.data.totalPages;
    state.totalItems = response.data.totalItems;
    state.pageSize = response.data.pageSize;
  } catch (error) {
    console.error('급여대장 목록을 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

const menuItem = [
  {
    label: '다운로드',
    icon: { src: '/src/assets/image/download_2.png' },
    action: () => api.get(`/hr/payroll-template/download`)
  },
  {
    label: '업로드',
    icon: { src: '/src/assets/image/upload_2.png' },
    action: () => api.post(`/hr/payroll-template/upload`)
  }
];

const columns = [
  { field: 'createDatetime',  label: '작성일' },
  { field: 'name',            label: '이름' },
  { field: 'totalEmp',        label: '총 인원' },
  { field: 'totalPay',        label: '총 지급액' },
];

onMounted(() => {
      fetchPayrolls();
      fetchThreeYearsByMonth();
      fetchThreeYears()
});

</script>

<template>
  <div>
    <h1>급여대장</h1>
  </div>
  <div>
    <div class="chart">
      <ThreeMonthChart />
    </div>
    <hr>
    <div>
      <ExcelDropDown
        buttonName="엑셀"
        :menuItems="menuItem"
      />
    </div>
    <div>
      <TableBasic
          :row-key="id"
          :rows="state.payrolls"
          :columns="columns"
      />
      <PagingBar
          :currentPage="state.currentPage"
          :totalPages="state.totalPages"
          :totalItems="state.totalItems"
          :pageSize="state.totalPages"
          @page-changed="fetchPayrolls"
      />
    </div>
  </div>
</template>

<style scoped>

</style>