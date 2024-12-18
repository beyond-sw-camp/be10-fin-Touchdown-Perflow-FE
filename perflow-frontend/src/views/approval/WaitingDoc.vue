<script setup>

import ButtonBasic from '@/components/common/ButtonBasic.vue';
import PagingBar from "@/components/common/PagingBar.vue";
import {onMounted, ref} from "vue";
import api from "@/config/axios.js";
import TableBasic from "@/components/common/TableCheck.vue";

const columns = [
  // { label: "문서번호", field: "docId" },
  { label: "제목", field: "title" },
  { label: "작성자", field: "createUserName" },
  { label: "작성일", field: "createDatetime" }
];

const waitingDocs = ref([]);    // 문서 목록
const totalPages = ref(0);      // 전체 페이지 수
const totalItems = ref(0);      // 전체 아이템 수
const currentPage = ref(1);     // 현재 페이지 번호
const pageSize = 10;            // 페이지당 문서 수

const selectedRows = ref([]);

// 대기 문서 목록 조회
const fetchWaitingDocs = async (page = 1) => {
  try {

    const response = (await api.get("/approval/waiting-docs", {
      params: {
        page: page - 1, // Spring의 Pageable은 0부터 시작하므로 -1 처리
        size: pageSize,
      }
    }));
    // api response 에서 데이터 추출
    console.log("대기 문서 조회 결과: ", response.data.content);

    waitingDocs.value = response.data.content;
    totalPages.value = response.data.totalPages;
    totalItems.value = response.data.totalElements;
    currentPage.value = response.data.number + 1; // Vue는 1부터 시작

  } catch (error) {
    console.error("대기 문서 목록 조회 실패", error);
    waitingDocs.value = [];
  }
}

// 일괄 승인
const bulkApproveDocs = async () => {
  if (selectedRows.value.length === 0) {
    alert("선택된 문서가 없습니다.");
    return;
  }

  try {
    console.log("선택된 데이터 확인: ", selectedRows.value)
    const approvals = selectedRows.value.map((row) => ({
      docId: row.docId,
      empId: row.empId, // 현재 로그인 한 사용자의 empId
      approveLineId: row.approveLineId,
      approveSbjId: row.approveSbjId,
      empDeptType: "EMPLOYEE",
      status: "APPROVED",
      comment: null,
    }));

    console.log("전달할 데이터: ", approvals);

    const requestData = {approvals};
    await api.put("approval/docs/bulk", requestData);

    alert("문서들이 일괄 승인되었습니다.");

    await fetchWaitingDocs(currentPage.value);  // 목록 새로 고침
    selectedRows.value = [];  // 선택 초기화
  } catch (error) {
    console.error("일괄 승인 실패", error);
    alert("일괄 승인에 실패하였습니다.");
  }
}

// 선택된 문서 처리
const handleRowSelected = (selected) => {
  console.log("선택된 행 데이터:", selected);
  selectedRows.value = selected;
}

onMounted(() => {
  fetchWaitingDocs();
});

</script>

<template>
  <!-- 헤더 -->
  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">대기 문서</p>
      <ButtonBasic
        color="orange"
        size="medium"
        label="검색하기"
        @click="fetchWaitingDocs(1)"
      />
    </div>
    <div id="header-bottom" class="flex-between">
      <div class="tabs">
        <h1>header bottom 영역 - 검색 바 여기에 추가 </h1>
      </div>
    </div>
  </div>

  <!-- 테이블  -->
  <div id="waiting-doc-list">
    <TableBasic
        :columns="columns"
        :rows="waitingDocs"
        rowKey="docId"
        :showCheckbox="true"
        @row-selected="handleRowSelected"
    >
      <!-- 날짜 포맷팅 커스터마이징 -->
      <template #createDatetime="{ value }">
        {{ new Date(value).toLocaleString() }}
      </template>
    </TableBasic>
  </div>

  <!-- 페이지네이션 -->
  <PagingBar
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalItems="totalItems"
      :pageSize="pageSize"
      @page-changed="fetchWaitingDocs"
  />

  <ButtonBasic
    color="orange"
    size="medium"
    label="일괄 승인하기"
    @click="bulkApproveDocs"
  />
</template>

<style scoped>
#waiting-doc-list {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  gap: 10px; /* 각 요소 간의 간격 */
  margin: 0 auto; /* 수평 중앙 정렬 */
}

#title {
  font-size: 40px;
  font-weight: bold;
  color: #3C4651;
}
#header-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-top: 120px;
}
#header-top, #header-bottom {
  margin-bottom: 10px;
  width: 900px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tabs {
  display: flex;
  gap: 20px;
  font-size: 25px;
}

.tab {
  cursor: pointer;
  padding: 5px 10px;
}

.tab.active {
  font-weight: bold;
  border-bottom: 2px solid #ff6600;
}
</style>