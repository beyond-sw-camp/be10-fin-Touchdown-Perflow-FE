<script setup>

import TableMini from "@/components/common/TableMini.vue";
import router from "@/router/router.js";
import {computed, onMounted, ref} from "vue";
import api from "@/config/axios.js";

const waitingDocs = ref(null);

// title 이 10자 이상일 경우 ... 로 대체
const truncateTitle = (title) => {
  return title.length > 10 ? title.substring(0, 10) + '...' : title;
}

// 날짜 형식 변경
const formatDate = (dateString) => {
  return `${dateString.slice(0, 4)}.${dateString.slice(5, 7)}.${dateString.slice(8, 10)}`;
};

const waitingRows = computed(() => {
  return (waitingDocs.value || []).map((doc) => ({
    docId: doc.docId,
    title: truncateTitle(doc.title), // 제목 길이 제한
    createUserName: doc.createUserName, // 작성자 이름
    createDatetime: formatDate(doc.createDatetime), // 생성일시 포맷
  }));
});

const waitingColumns = [
  { field: "title", label: "제목" },
  { field: "createUserName", label: "작성자" },
  { field: "createDatetime", label: "작성일시" },
];

// 데이터 가져오기
const fetchWaitingDocs = async () => {
  try {
    const response = await api.get("/approval/waiting-docs", {
      params: { size: 10 },
    });
    waitingDocs.value = response.data.content; // content에 데이터가 담겨 있음
    console.log("waitingDocs.value");
  } catch (error) {
    console.error("대기 문서 데이터를 가져오는 중 오류 발생:", error);
  }
};

const goToWaiting = () => {
  router.push('/approval/waiting')
}

onMounted(() => {
  fetchWaitingDocs();
})
</script>

<template>
  <div class="home-container">
    <!-- 헤더 -->
    <div class="home-header">
      <span class="home-title">결재 홈</span>
    </div>

    <!-- 내용 -->
    <div class="home-content">

      <!-- 문서함 -->
      <div class="doc-box">

        <!-- 대기 문서 -->
        <div class="waiting">
          <div class="waiting-title">
            <Button @click="goToWaiting">
              대기 문서
              <img src="../../assets/image/left.png" alt="left" />
            </Button>
          </div>
          <TableMini
              row-key="docId"
              :rows="waitingRows"
              :columns="waitingColumns"
          />
        </div>
        <!-- 처리 문서 -->
      </div>

      <div class="inout-box">

        <!-- 수신함 -->
        <!-- 발신함 -->
      </div>

    </div>
  </div>
</template>

<style scoped>


/* 대기 문서 */
.waiting-title {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.waiting button {
  border: none;
  background: none;
  cursor: pointer;
  color: #3C4651;
  font-size: 25px;
  font-weight: bold;
  padding: 0;
}

.waiting img {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}
</style>