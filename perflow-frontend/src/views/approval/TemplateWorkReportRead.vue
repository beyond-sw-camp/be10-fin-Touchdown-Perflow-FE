<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import {computed, onMounted, ref} from "vue";
import {createNewDocument} from "@/config/approval.js";
import router from "@/router/router.js";
import ApprovalShareBoxRead from "@/components/approval/ApprovalShareBoxRead.vue";
import api from "@/config/axios.js";
import {useRoute} from "vue-router";

const route = useRoute();

// 전달된 데이터 가져오기
const docId = route.query.docId;
const docType = route.query.type;
const approveSbjStatus = route.query.approveSbjStatus;
const processDatetime = route.query.processDatetime;
const comment = route.query.comment;

// 초기화
const title = ref("");
const createUserData = ref("");
const createDatetime = ref("");
const fromToDate = ref("");
const PROGRESSING = ref("");
const SPECIAL = ref("");
const PLANNED = ref("");
const approveLines = ref([]);
const shares = ref([]);

// API 호출로 데이터 가져오기
const fetchDocumentDetail = async () => {
  try {
    const response = await api.get(`/approval/waiting-docs/${docId}`);
    const docData = response.data;
    title.value = docData.title; // 제목
    createUserData.value = docData.createUserDept + " " + docData.createUserName + " " + docData.createUserPosition;
    createDatetime.value = formatCreateDatetime(docData.createDatetime);  // 작성일시
    fromToDate.value = formatDate(docData.fields?.fromDate) + " ~ " + formatDate(docData.fields?.toDate);
    PROGRESSING.value = docData.fields?.PROGRESS;
    SPECIAL.value = docData.fields?.SPECIAL;
    PLANNED.value = docData.fields?.PLANNED;

    approveLines.value = docData.approveLines || []; // 결재선 데이터
    shares.value = docData.shares || [];  // 공유 데이터
  } catch (error) {
    console.error("문서 상세 조회 실패:", error);
    alert("문서 데이터를 불러오지 못했습니다.");
  }
};

const goTo = (url) => {
  router.push(url);
}

// 작성일시 형식 변환
const formatCreateDatetime = (rawString) => {

  if (!rawString) {
    return "날짜 정보 없음";
  }
  const date = new Date(rawString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `
      + `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
};

// 진행일 형식 변환
const formatDate = (rawString) => {
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

const formatStatus = computed(() => {
  if (approveSbjStatus === "APPROVED") {
    return "승인";
  }
  if (approveSbjStatus === 'REJECTED') {
    return "반려";
  }
  return "알 수 없음";
})

const formatProcessDatetime = (rawString) => {
  if (!rawString) return "날짜 정보 없음";
  const date = new Date(rawString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 `
      + `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
}

onMounted(() => {
  fetchDocumentDetail();
})

</script>

<template>

  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">문서 상세 조회</p>
    </div>
    <div id="header-bottom" class="flex-between">
      <div class="tabs">
        <span class="tab active">업무 보고서</span>
      </div>
    </div>
  </div>

  <div class="main-container">
    <!-- 빈 컨테이너 -->
    <div class="empty-container"></div>
    <div class="form-container">
      <div class="field-container">
        <!-- 작성일자 -->
        <div class="field">
          <span class="label">작성일시</span>
          <span class="value">{{ createDatetime }}</span>
        </div>
        <!-- 진행기간 -->
        <div class="field">
          <span class="label">진행기간 </span>
          <span class="value">{{ fromToDate }}</span>
        </div>
        <!-- 부서 작성자이름 직급 -->
        <div class="field">
          <span class="label">작성자</span>
          <span class="value">{{ createUserData }}</span>
        </div>
        <!-- 제목 -->
        <div class="field">
          <span class="label">제목</span>
          <span class="value">{{ title }}</span>
        </div>
        <!-- 진행사항 -->
        <div class="field">
          <span class="label">진행사항</span>
          <span class="value">{{ PROGRESSING }}</span>
        </div>
        <!-- 특이사항 -->
        <div class="field">
          <span class="label">특이사항</span>
          <span class="value">{{ SPECIAL }}</span>
        </div>
        <!-- 예정사항 -->
        <div class="field">
          <span class="label">예정사항</span>
          <span class="value">{{ PLANNED }}</span>
        </div>

      <ButtonBasic
          color="orange"
          size="medium"
          label="목록으로"
          @click="router.go(-1)"
      />
      </div>
    </div>

    <div class="box-container">

      <!-- 처리 문서 정보 -->
      <div class="processed-info-container">
        <span class="processed-info-title">나의 처리 이력</span>
        <div v-if="docType === 'processed'" class="processed-info">
          <div class="doc-type">
            <span class="doc-type-label">결재 여부 </span>
            <span class="doc-type-tag">{{ formatStatus }}</span>
          </div>
          <div class="doc-process-time">
            <span class="doc-process-time-label">처리일시 </span>
            <span class="doc-process-time-value"> {{ formatProcessDatetime(processDatetime) }}</span>
          </div>
          <div class="doc-comment">
            <span class="comment-title">나의 의견</span>
            <div
                class="approval-comment"
                :class="{ 'empty-comment': !comment }"
            >
              <span class="comment-text">{{ comment ? comment : '작성한 의견이 없습니다.' }}</span>
            </div>
          </div>

        </div>
      </div>

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
}

.box-container {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-container {
  display: flex;
  flex-direction: column;
  gap: 30px;  /* 필드 간 간격 */
  width: 100%
}

.field {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}

.label {
  font-weight: bold;
  font-size: 18px;
  color: #3C4651;
  flex: 0 0 100px;  /* 라벨의 고정 너비 설정! */
  border-right: 2px solid #D9D9D9;
  text-align: left;
}
.value {
  font-size: 16px;
  color: #3C4651;
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


/* 처리 문서 정보 */
.processed-info-title {
  font-size: 15px;
  font-weight: bold;
  color: #3C4651;
}

.processed-info {
  margin-top: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  background-color: #fafafa;
  align-items: center;
  justify-content: center;
}

.doc-type-tag {
  margin-left: 10px;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  background-color: #05A730;
}

.doc-process-time {
  margin-top: 10px;
}

.doc-type-label,
.doc-process-time-label {
  color: #3C4651;
  font-weight: bold;
  font-size: 15px;
}

.doc-process-time-value {
  margin-left: 10px;
  font-size: 15px;
}

.approval-comment {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  background-color: white;
  align-items: center;
  justify-content: center;
}

.doc-comment {
  margin-top: 10px;
}

.approval-comment {
  margin-top: 5px;
}

.empty-comment {
  color: #a0a0a0;
  font-size: 15px;
}
.comment-title {
  font-size: 15px;
  font-weight: bold;
  color: #3C4651;
}
</style>