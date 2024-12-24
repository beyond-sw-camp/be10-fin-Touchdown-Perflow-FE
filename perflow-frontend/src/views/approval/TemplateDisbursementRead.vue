<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/approval/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import {computed, onMounted, ref} from "vue";
import OrganizationTree from "@/components/approval/OrganizationTree.vue";
import draggable from "vuedraggable";
import {createBasicDoc} from "@/config/approval.js";
import router from "@/router/router.js";
import ButtonDropDown from "@/components/common/ButtonDropDown.vue";
import SearchGroupBar from "@/components/common/SearchGroupBar.vue";
import {useRoute} from "vue-router";
import api from "@/config/axios.js";
import ApprovalShareBoxRead from "@/components/approval/ApprovalShareBoxRead.vue";

const route = useRoute();

// 전달된 데이터 가져오기
const docId = route.query.docId; // 전달된 docId

// 초기화
const title = ref("");
const createUser = ref("");
const createDatetime = ref("");
const expendDate = ref("");
const approveLines = ref([]);
const shares = ref([]);
const rows = ref([]);

// API 호출로 데이터 가져오기
const fetchDocumentDetail = async () => {
  try {
    const response = await api.get(`/approval/waiting-docs/${docId}`);
    const docData = response.data;
    title.value = docData.title; // 제목
    createUser.value = docData.createUserName;  // 작성자
    createDatetime.value = formatCreateDatetime(docData.createDatetime);  // 작성일시
    expendDate.value = formatExpendDate(docData.fields?.expendDate);  // 지출일

    // 테이블 데이터
    const fieldData = docData.fields || {};
    rows.value = [];
    let index = 1;
    while (fieldData[`VENDOR${index}`] !== undefined) {
      rows.value.push({
        vendor: fieldData[`VENDOR${index}`] || "",
        usage: fieldData[`USAGE${index}`] || "",
        amount: fieldData[`AMOUNT${index}`] || "0",
      })
      index++;
    }

    approveLines.value = docData.approveLines || []; // 결재선 데이터
    shares.value = docData.shares || [];  // 공유 데이터
  } catch (error) {
    console.error("문서 상세 조회 실패:", error);
    alert("문서 데이터를 불러오지 못했습니다.");
  }
};

// 작성일시 형식 변환
const formatCreateDatetime = (rawString) => {

  if (!rawString) {
    return "날짜 정보 없음";
  }
  const date = new Date(rawString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `
      + `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
};

// 지출일 형식 변환
const formatExpendDate = (rawString) => {
  if (!rawString) {
    return "날짜 정보 없음";
  }
  const date = new Date(rawString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 한글로 변환
const TypeMapping = {
  SEQ: "동의",
  CC: "참조",
  AGR: "합의",
  PLL: "병렬",
  PLLAGR: "병렬 합의",
}

// 합계 계산
// const totalAmount = computed(() => {
//   return rows.value.reduce((sum, row) => sum + Number(row.amount || 0), 0);
// });

onMounted(() => {
  fetchDocumentDetail();
})

</script>

<template>

  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">대기 문서 상세 조회</p>
    </div>
    <div id="header-bottom" class="flex-between">
      <div class="tabs">
        <span class="tab active">지출 결의서</span>
      </div>
    </div>
  </div>

  <div class="main-container">
    <!-- 빈 컨테이너 -->
    <div class="empty-container"></div>
    <div class="form-container">
      <div class="field-container">
        <!-- 제목 -->
        <InputField
            v-model="title"
            label="제목"
            width="600px"
        />
        <!-- 작성자 -->
        <InputField
            v-model="createUser"
            label="작성자"
            width="600px"
        />
        <!-- 작성일 -->
        <InputField
            v-model="createDatetime"
            label="작성일시"
            width="600px"
        />
        <!-- 지출일 -->
        <InputField
          v-model="expendDate"
          label="지출일"
        />
      </div>

      <!-- 지출 내역 테이블 -->
      <div class="table-container">
        <table class="expense-table">
          <thead>
          <tr>
            <th>거래처</th>
            <th>사용내역</th>
            <th>금액</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td>{{ row.vendor || "" }}</td>
              <td>{{ row.usage || "" }}</td>
              <td>{{ Number(row.amount).toLocaleString() }} 원</td>
            </tr>
          </tbody>
        </table>

        <!-- 합계 -->
        <div class="total">
          <span>합계 {{ rows.reduce((sum, row) => sum + Number(row.amount || 0), 0).toLocaleString() }} 원 </span>
        </div>
      </div>

        <ButtonBasic
            color="orange"
            size="medium"
            label="목록으로"
            @click=""
        />
      </div>
    </div>

  <div class="box-container">
    <!-- 결재선 -->
    <ApprovalShareBoxRead
        title="결재선"
        :placeholder="'결재선 정보가 없습니다.'"
        :data="approveLines.map(line => ({
              type: TypeMapping[line.approveType],
              name: line.approveSbjs[0]?.sbjName || '정보 없음',
        }))"
    />

    <!-- 공유 -->
    <ApprovalShareBoxRead
        title="공유"
        :placeholder="'공유 정보가 없습니다.'"
        :data="shares.map(share => ({
              type: '공유',
              name: share.empNames[0] || '정보 없음',
        }))"
    />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 세로 정렬 */
  gap: 0px;
}

.empty-container {
  flex: 0.3;
  max-width: 300px;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  width: 400px;
  margin-top: 50px;
  position: relative; /* 유동적인 위치 */
}

.box-container {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.approval-table th,
.approval-table td {
  border: none; /* 내부 셀의 모든 테두리 제거 */
  border-bottom: 1px solid #D9D9D9; /* 셀 아래 가로선만 표시 */
  padding: 8px;
  text-align: center;
}

.approval-table tr:last-child td {
  border-bottom: none; /* 마지막 행의 아래쪽 가로선 제거 */
}

.approval-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}




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

.tabs {
  display: flex;
  gap: 20px;
  font-size: 20px;
}

.tab {
  cursor: pointer;
  padding: 5px 10px;
}

.tab.active {
  font-weight: bold;
  border-bottom: 2px solid #ff6600;
}

/* 지출 내역 테이블 */
.expense-table {
  width: 100%;
  border-collapse: separate; /* 셀 경계와 테두리 중첩 방지 */
  border-spacing: 0; /* 셀 간 간격 제거 */
  border: 1px solid #AFA9A9; /* 테이블 전체 테두리 */
  border-radius: 10px; /* 테이블 모서리 둥글게 */
  overflow: hidden; /* 둥근 모서리 유지 */
}

.expense-table th,
.expense-table td {
  border-bottom: 1px solid #AFA9A9; /* 셀 내부에만 경계선 추가 */
  border-right: 1px solid #AFA9A9; /* 셀 오른쪽 경계선 추가 */
  text-align: center;
}

.expense-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  font-size: 14px;
}

.expense-table input {
  border: none; /* 입력 필드 테두리 제거 */
  outline: none;  /* 포커스 하면 나오는 테두리 제거 */
  text-align: left;
  padding: 4px;
}

/* 금액 칸 화살표 제거 */
.expense-table input[type="number"]::-webkit-inner-spin-button,
.expense-table input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.total {
  margin-top: 50px;
  margin-bottom: 50px;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid #ff6600;
  border-top: 2px solid #ff6600;
}
</style>