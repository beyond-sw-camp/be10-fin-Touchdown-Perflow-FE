<script setup>
import { reactive, onMounted } from "vue";
import api from "@/config/axios.js";
import PagingBar from "@/components/common/PagingBar.vue";
import ExcelDropDown from "@/components/common/ExcelDropDown.vue";
import TableBasic from "@/components/common/TableBasic.vue";
import ThreeMonthChart from "@/views/payment/ThreeMonthChart.vue";
import ThreeYearByMonthChart from "@/views/payment/ThreeYearByMonthChart.vue";
import ThreeYearChart from "@/views/payment/ThreeYearChart.vue";

const state = reactive({
  payrolls: [],
  currentPage: 1,
  totalPages: 1,
  totalItems:0,
  pageSize: 10
});

// 급여대장 목록을 가져오는 함수
const fetchPayrolls = async (page = 1) => {
  try {
    const response = await api.get(`/hr/payrolls`, {
      params: {
        page
      }
    });
    // 'name' 필드에서 연도와 월을 분리하고, 형식 'YYYY.MM'으로 변환
    state.payrolls = response.data.payrolls.map(payroll => ({
      ...payroll,
      createDatetime: `${payroll.createDatetime.slice(0,4)}.${payroll.createDatetime.slice(5,7)}.${payroll.createDatetime.slice(8,10)}`,
      name: `${payroll.name.slice(13, 15)}월 대장`,  // 예: '202408' -> '2024.08'
    }));
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
});

</script>

<template>
  <div class="container">
    <h1 class="title">급여대장</h1>
    <div>
      <div class="three-month-chart">
        <ThreeMonthChart />
      </div>
      <div class="chart">
        <div class="three-year-by-month-chart">
          <ThreeYearByMonthChart />
        </div>
        <div class="three-year-chart">
          <ThreeYearChart />
        </div>
      </div>
      <hr>
      <div class="btn">
        <ExcelDropDown
          buttonName="엑셀"
          :menuItems="menuItem"
        />
      </div>
      <div class="table">
        <TableBasic
            :row-key="id"
            :rows="state.payrolls"
            :columns="columns"
        />
      </div>
      <div class="paging-bar">
        <PagingBar
            :currentPage="state.currentPage"
            :totalPages="state.totalPages"
            :totalItems="state.totalItems"
            :pageSize="state.totalPages"
            @page-changed="fetchPayrolls"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  width: 900px;
  justify-content: center;
  margin: 10px 0 10px 0;
  color: #3c4651;
}

.three-month-chart {
  width: 900px;
  margin-bottom: 10px;
}

.chart {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 900px;
}

.three-year-by-month-chart {
  width: 400px;
}

.three-year-chart {
  width: 400px;
}

hr {
  width: 900px;
}

.btn {
  display: flex;
  flex-direction: row-reverse;
  width: 900px;
  padding: 0;
  margin: 0 0 15px 0;
}

.table {
  width: 900px;
}

.paging-bar {
  width: 900px
}

</style>