<script setup>
import {computed, onMounted} from "vue";
import {useAuthStore} from "@/store/authStore.js";

const authStore = useAuthStore();

const msTime = computed(() => {
  return authStore.$state.remainingTime
});

const isLogin = computed(()=>{
  return authStore.$state.isLogin;
});

const fetchTimer = () => {
  if(isLogin){
    authStore.startTimer();
  }
};
const refresh = () => {
  authStore.refreshAccessToken();
}
onMounted(()=> {
  fetchTimer();
});
</script>

<template>
  <div id="nav">
    <div id="nav-logo">
      <img src="@/assets/image/logo.png" alt="로고" id="logo-image">
      <span id="logo-text">Perflow</span>
    </div>
    <div class="nav-right" v-if="isLogin">
      <p id="timer">남은시간 {{msTime}}</p>
      <img id="refresh" src="@/assets/image/refresh.png" alt="유효시간 연장" @click="refresh">
    </div>
  </div>
</template>

<style scoped>
#nav {
  display: flex;
  height: 81px;
  justify-content: space-between; /* 가로로 배치, 양 끝에 여유 공간 */
  align-items: center;            /* 세로축 중앙 정렬 */
  width: 100%;                    /* 전체 너비 */   /* 예시: 화면 전체 높이 */
  border-bottom: 1px solid #817F7F;
}
#nav-logo, #nav-right {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* 가운데 정렬 */
}
#logo-image {
  width: 50px;
  height: 50px;
  margin-right: 5px;
}
#logo-text {
  font-weight: bold;
  font-size: 30px;
  font-family: Inter;
  margin-left: 5px;
}
.nav-right {
  /* 오른쪽 끝으로 자동 정렬됨 */
  text-align: right;
  position: absolute;
  right: 0;
  padding-right: 30px;
  display: flex;
}
#timer {
  margin: 0 10px;
  font-weight: bold;
}
#refresh {
  width: 25px;
  height: 25px;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
</style>