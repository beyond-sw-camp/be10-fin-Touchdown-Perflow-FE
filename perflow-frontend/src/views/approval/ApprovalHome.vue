<script setup>

import TableMini from "@/components/common/TableMini.vue";
import router from "@/router/router.js";
import {computed, ref} from "vue";
import api from "@/config/axios.js";

const waiting = ref(null);

// title 이 10자 이상일 경우 ... 로 대체
const truncateTitle = (title) => {
  return title.length > 8 ? title.substring(0, 8) + '...' : title;
}

const waitingRows = computed(() => {
  const wait = Array.isArray(waiting.value) ? waiting.value : [];
  return wait.map((item) => ({
    ...item,
    title: truncateTitle(item.title),
    createDatetime: formatDate(item.createDatetime),
  }));
})

const fetchWaiting = async() => {

  try {
    const pageResponse = await api.get('/approval/waiting', {
      params: { size: 10 }
    });

    const lastPage = pageResponse.data.totalPages - 1;

    const response = await api.get('/approval/waiting', {
      params: {
        page: lastPage,
        size: 10
      }
    });

    waiting.value = response.data.content.sort((a, b) => {
      const dateA = new Date(a.createDatetime);
      const dateB = new Date(b.createDatetime);
      return dateB - dateA; // 내림차순 정렬
    })
  } catch (error) {
    console.error('대기 문서 정보를 불러올 수 없습니다. :', error);
  }
}

const goToWaiting = () => {
  router.push('/approval/waiting')
}
</script>

<template>
<h1> 결재 홈 입니다. 열심히 만드는 중! ^_^ /</h1>

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
              row-key="id"
              rows="waitingRows"
              columns="waitingColumns"
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