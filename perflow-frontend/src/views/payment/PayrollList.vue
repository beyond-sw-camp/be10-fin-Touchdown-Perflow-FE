<script setup>
import {reactive, onMounted, ref } from "vue";
import api from "@/config/axios.js";
import PagingBar from "@/components/common/PagingBar.vue";
import ExcelDropDown from "@/components/common/ExcelDropDown.vue";
import TableBasic from "@/components/common/TableBasic.vue";
import ThreeMonthChart from "@/views/payment/ThreeMonthChart.vue";
import ThreeYearByMonthChart from "@/views/payment/ThreeYearByMonthChart.vue";
import ThreeYearChart from "@/views/payment/ThreeYearChart.vue";
import FileUpload from "@/components/common/FileUpload.vue";
import ButtonBasic from "@/components/common/ButtonBasic.vue";

const state = reactive({
  payrolls: [],
  currentPage: 1,
  totalPages: 1,
  totalItems:0,
  pageSize: 10
});

const isFileUploadVisible = ref(false); // 파일 업로드 창 표시 여부

// 선택된 파일 목록을 저장할 변수
const selectedFiles = ref([]);

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
      totalPay: new Intl.NumberFormat('ko-KR').format(payroll.totalPay) + '원'  // 'totalPay' 값을 천단위로 포맷팅하고 원 추가
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
    action: async () => {
      try {
        // 서버에서 파일을 바이너리 형식으로 받아옵니다.
        const response = await api.get(`/hr/payroll-template/download`, { responseType: 'blob' });

        // Blob 데이터를 URL로 변환합니다.
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        // 현재 날짜로 파일명을 설정합니다.
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const fileName = `payroll_${year}_${month}.xlsx`; // 예: payroll_2024_12.xlsx

        // 다운로드를 위한 가상 링크를 생성합니다.
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // 동적으로 파일명 설정
        document.body.appendChild(link);
        link.click(); // 다운로드 시작

        // 다운로드 후 링크를 제거합니다.
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // URL 객체를 해제합니다.
      } catch (error) {
        console.error('파일 다운로드 중 오류 발생:', error);
        alert('파일 다운로드에 실패했습니다.');
      }
    }
  },
  {
    label: "업로드",
    icon: { src: "/src/assets/image/upload_2.png" },
    action: () => (isFileUploadVisible.value = true), // 업로드 창 표시
  },
];

// 파일 업로드 핸들러
const handleFileUpload = async () => {
  if (selectedFiles.value.length === 0) {
    alert("업로드할 파일을 선택해주세요.");
    return;
  }

  const formData = new FormData();
  selectedFiles.value.forEach(file => {
    formData.append('file', file);
  });

  try {
    const response = await api.post('/hr/payroll-template/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("업로드 성공:", response.data);
    alert("파일이 성공적으로 업로드되었습니다.");
    isFileUploadVisible.value = false; // 모달 닫기
  } catch (error) {
    console.error("업로드 실패:", error);
    alert("파일 업로드 중 오류가 발생했습니다.");
  }
};

// 파일 선택 이벤트 핸들러
const handleFilesSelected = (files) => {
  selectedFiles.value = files;
};

// 파일 업로드 모달 닫기 함수
const handleCancel = () => {
  isFileUploadVisible.value = false; // 모달 숨기기
};

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
      <div class="excel">
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
    <!-- 파일 업로드 컴포넌트 -->
    <div v-if="isFileUploadVisible" class="file-upload-modal">
      <FileUpload
          mode="both"
          :buttonWidth="'150px'"
          :buttonHeight="'50px'"
          :multiple="false"
          @files-selected="handleFilesSelected"
      />
      <div class="button">
        <ButtonBasic
            color="orange"
            size="medium"
            label="업로드"
            @click="handleFileUpload"
        />
        <div style="margin-left: 10px"/>
        <ButtonBasic
            color="gary"
            size="medium"
            label="취소"
            @click="handleCancel"
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

.excel {
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

.file-upload-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 450px;
}

.button {
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10px;
}

</style>