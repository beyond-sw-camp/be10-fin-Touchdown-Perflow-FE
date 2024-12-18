<script setup>
import {computed, ref} from "vue";

const password = ref("");
const passwordCheck = ref("");

const validPwd = computed(()=>{
  return password.value === passwordCheck.value;
});

const pwdRegister = async () => {

}
</script>

<template>
  <article id="pwd-register-div">
    <p class="title">Perflow 가입 비밀번호 등록</p>
    <div class="input-group">
      <span class="input-title">비밀번호</span><br>
      <input type="text" class="password-input" v-model="password" placeholder="비밀번호를 입력해주세요.">
    </div>
    <div class="input-group">
      <span class="input-title">비밀번호 확인</span><br>
      <input type="password" class="password-input" v-model="passwordCheck" placeholder="동일한 비밀번호를 입력해주세요.">
    </div>
    <p v-if="!validPwd&&passwordCheck" id="pwd-check-false">
      비밀번호가 일치하지 않습니다.
    </p>
    <p v-if="validPwd&&passwordCheck" id="pwd-check-true">
      비밀번호가 일치합니다!.
    </p>
    <button @click="pwdRegister" class="register-button" :disabled="!validPwd">로그인</button>
  </article>
</template>

<style scoped>
#pwd-register-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  gap: 10px; /* 각 요소 간의 간격 */
  margin: 0 auto; /* 수평 중앙 정렬 */
  padding-top: 100px;
}
.title {
  font-size: 50px;
  font-weight: bold;
  background: linear-gradient(90deg, #F37321, #FFBB00);
  /* 크로스 브라우저 호환을 위해 -webkit-background-clip 사용 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* 일부 브라우저는 이 속성 사용 */
}
.input-title {
  font-weight: bold;
  font-size: 20px;
}
/* 각 입력 필드를 감싸는 그룹 */
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center; /* 텍스트와 입력창 가로 중앙 정렬 */
  text-align: center; /* 텍스트 중앙 정렬 */
}
#pwd-check-false{
  font-weight: bold;
  color: #F91100;
}
#pwd-check-true{
  font-weight: bold;
  color: limegreen;
}
/* 입력 필드 스타일 */
.password-input {
  width: 500px;
  height: 50px;
  border-radius: 4px;
  text-align: center; /* 입력 값 중앙 정렬 */
  font-size: 20px !important;
  margin-bottom: 5px;
}
.password-input:-webkit-autofill {
  background-color: white !important; /* 자동완성 시 배경 흰색 */
  -webkit-box-shadow: 0 0 0 1000px white inset !important; /* 내부 흰색 영역 */
}

.register-button {
  width: 500px;
  height: 50px;
  background: linear-gradient(90deg, #F37321, #FFBB00);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  margin-top: 30px;
}
.register-button:hover {
  background-color: #ff5a45;
}
.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>