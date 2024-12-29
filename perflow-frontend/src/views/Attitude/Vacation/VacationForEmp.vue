<script setup>

import SearchGroupBar from "@/components/common/SearchGroupBar.vue";
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import {onMounted, ref, computed} from "vue";
import api from "@/config/axios.js";
import router from "@/router/router.js";
import TableBasic from "@/components/common/TableBasic.vue";
import PagingBar from "@/components/common/PagingBar.vue";
import ButtonDropDown from "@/components/common/ButtonDropDown.vue";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // 플러그인 추가
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const today = dayjs(); // 현재 날짜와 시간
console.log(today.format('YYYY-MM-DD'));

// 테이블 컬럼 설정
const columns = [
  {label: "휴가 종류", field: "vacationTypeLabel"}, // 한글 휴가 종류
  {label: "신청일", field: "enrollVacation"},       // 신청일
  {label: "시작일", field: "vacationStart"},        // 시작일
  {label: "종료일", field: "vacationEnd"},          // 종료일
  {label: "상태", field: "vacationStatusLabel"},    // 상태
];

// 열 너비 설정
const columnWidths = ["150px", "120px", "120px", "120px", "100px"];



// 매핑 테이블 (영문 -> 한글 변환)
const vacationTypeMap = {
  MATERNITY: "출산 휴가",
  SPOUSEMATERNITY: "배우자 출산 휴가",
  MENSTRUAL: "생리 휴가",
  FAMILYCARE: "가족 돌봄 휴가",
};

const vacationStatusMap = {
  CONFIRMED: "승인",
  REJECTED: "반려",
  PENDING: "대기",
};

// 상태 변수
const allDocs = ref([]);         // 전체 데이터
const filteredDocs = ref([]);    // 필터링된 데이터
const totalPages = ref(1);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = 10;

// 검색 조건
const searchCriteria = ref({
  vacationType: "",
  fromDate: "",  // 시작일 기본값: 오늘 날짜
  toDate: "",    // 종료일 기본값: 오늘 날짜
  status: ""
});


const statusOptions = [
  { label: "전체", id: "" },         // 기본값: 전체 (필터 해제)
  { label: "대기", id: "PENDING" },  // 대기
  { label: "승인", id: "CONFIRMED" }, // 승인
  { label: "반려", id: "REJECTED" }  // 반려
];


// API 데이터 호출 (전체 조회)
const fetchVacationData = async () => {
  try {
    const response = await api.get("emp/vacation/details");
    console.log("API 응답 데이터:", response.data);



    // 데이터 변환 및 저장
    allDocs.value = response.data.map((item) => ({
      vacationTypeLabel: vacationTypeMap[item.vacationType], // 한글 휴가 종류
      enrollVacation: item.enrollVacation.split("T")[0],     // 신청일
      vacationStart: item.vacationStart.split("T")[0],       // 시작일
      vacationEnd: item.vacationEnd.split("T")[0],           // 종료일
      vacationStatusLabel: vacationStatusMap[item.vacationStatus], // 상태
      vacationType: item.vacationType,  // 원본 값 (필터링 용도)
      vacationStatus: item.vacationStatus // 원본 상태
    }));
    console.log("API 응답 데이터:", response.data);
    console.log("변환된 데이터:", allDocs.value);
    // 필터 초기화 및 페이징 적용
    applyFilter(true);

  } catch (error) {
    console.error("휴가 데이터 조회 실패:", error);
    allDocs.value = [];
  }
};

// 필터 적용 및 데이터 갱신
const applyFilter = (resetPage = true) => {
  console.log("현재 검색 조건:", searchCriteria.value);

  // 초기 필터 대상 데이터
  let filtered = [...allDocs.value]; // 배열 복사 (원본 데이터 보존)
  console.log("필터 적용 전 데이터:", filtered);

  // 필터 조건 확인 및 적용
  if (searchCriteria.value.vacationType) {
    filtered = filtered.filter(
        (item) => item.vacationType === searchCriteria.value.vacationType
    );
  }
  if (searchCriteria.value.fromDate && searchCriteria.value.toDate) {
    filtered = filtered.filter(
        (item) =>
            dayjs(item.vacationStart).isSameOrAfter(dayjs(searchCriteria.value.fromDate)) &&
            dayjs(item.vacationEnd).isSameOrBefore(dayjs(searchCriteria.value.toDate))
    );
  }
  else if (searchCriteria.value.fromDate) {
    filtered = filtered.filter(
        (item) => dayjs(item.vacationStart).isSameOrAfter(dayjs(searchCriteria.value.fromDate))
    );
  }
  else if (searchCriteria.value.toDate) {
    filtered = filtered.filter(
        (item) => new Date(item.vacationEnd) <= new Date(searchCriteria.value.toDate)
    );
  }
  if (searchCriteria.value.status) {
    filtered = filtered.filter(
        (item) => item.vacationStatus === searchCriteria.value.status
    );
  }
  console.log("필터 적용 후 데이터:", filtered);

  // 필터링된 결과 저장 및 페이징 적용
  filteredDocs.value = filtered;
  totalItems.value = filtered.length;
  totalPages.value = Math.ceil(totalItems.value / pageSize);
  // 필터 적용 시 첫 페이지로 초기화
  if (resetPage) {
    currentPage.value = 1;
  }
};

// 페이징 처리
const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;

  console.log("현재 페이지:", currentPage.value);
  console.log("필터링된 데이터 수:", filteredDocs.value.length);
  console.log("현재 페이지 데이터:", filteredDocs.value.slice(start, end));

  return filteredDocs.value.slice(start, end);
});

// 검색 처리
const handleSearch = () => {
  console.log("검색 버튼 클릭");
  applyFilter(); // 필터 적용
};

// 페이지 변경 시 호출
const handlePageChange = (page) => {
  currentPage.value = page;
  applyFilter(false);
};

const handleStatusSelect = (selectedLabel) => {
  // 선택된 상태 라벨을 영문(enum) 값으로 변환
  const selectedStatus = statusOptions.find(option => option.label === selectedLabel)?.id || "";
  searchCriteria.value.status = selectedStatus; // 영문(enum) 값 저장

  console.log("선택된 상태:", selectedStatus);

  // 상태 변경 즉시 필터 적용 (첫 페이지로 리셋)
  applyFilter(true); // 첫 페이지로 리셋
};


// 초기 로드
onMounted(() => {
  fetchVacationData();
});
</script>


<template>
  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">휴가 관리 </p>
    </div>
    <div id="header-bottom" class="flex-between">
      <div id="search-container">
        <!-- 검색 필드 -->
        <div class="conditions">
          <SearchGroupBar
              v-model="searchCriteria.fromDate"
              placeholder="휴가 시작일"
              type="date"
          />
          <SearchGroupBar
              v-model="searchCriteria.toDate"
              placeholder="휴가 종료일"
              type="date"
          />
          <ButtonDropDown
              :options="statusOptions"
              default-option="전체"
              width="150px"
              height="40px"
              @select="handleStatusSelect"
          />

        </div>
        <div class="button">
          <ButtonBasic
              color="orange"
              size="medium"
              label="검색하기"
              @click="handleSearch"
          />
        </div>
      </div>
    </div>

    <div class="table-container">
      <TableBasic
          :row-key="'vacationId'"
          :rows="paginatedDocs"
          :columns="columns"
          :column-widths="columnWidths"
      />
    </div>

    <!-- 페이징 바 -->
    <div class="paging-bar">
      <PagingBar
          :page-size="pageSize"
          :total-items="totalItems"
          :total-pages="totalPages"
          :current-page="currentPage"
          @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<style scoped>

#title {
  font-size: 35px;
  font-weight: bold;
  color: #3C4651;
}

#header-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-top: 50px;
}

#header-top, #header-bottom {
  margin-bottom: 10px;
  width: 900px;
}

#processed-doc-container {
  display: flex;
  flex-direction: column; /* 테이블과 버튼을 세로로 배치 */
  gap: 10px; /* 테이블과 버튼 간 간격 */
  width: 900px; /* 테이블과 버튼이 같은 폭 */
  margin: 0 auto; /* 중앙 정렬 */
}

#processed-doc-list {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  gap: 10px; /* 각 요소 간의 간격 */
  margin: 0 auto; /* 수평 중앙 정렬 */
}

/* 테이블 내 제목 컬럼 */
.clickable-title {
  color: #3C4651;
  cursor: pointer;
}

.clickable-title:hover {
  color: #f37321;
  text-decoration: underline;
}


/* 검색 컨테이너 */
#search-container {
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  align-items: center;
  justify-content: space-between;
  padding: 10px; /* 내부 여백 */
  border: 1px solid #AFA9A9;
  border-radius: 10px;
  gap: 0px;
}

.conditions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 필드 간 간격 */
}

.button {
  display: flex;
  justify-content: flex-end;
  width: 100% /* 오른쪽 끝에 검색*/
}

.table-container {
  width: 900px;
  margin-top: 20px;
}

.paging-bar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 테이블 관련 스타일 */
table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}


</style>