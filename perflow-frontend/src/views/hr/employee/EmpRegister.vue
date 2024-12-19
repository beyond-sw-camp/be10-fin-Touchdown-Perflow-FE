<script setup>

import HeaderContainer from "@/components/hr/HeaderContainer.vue";
import RegisterInputField from "@/components/modifyer/RegisterInputField.vue";
</script>

<template>
  <div id="emp-register-container">
    <HeaderContainer
      title="구성원"
      flow="구성원 등록"
    />
    <p class="sub-title">필수입력</p>
    <div id="register-container-top">
      <RegisterInputField title="사원명" placeholder="사원명을 입력해주세요." size="small"/>
      <RegisterInputField title="사번" placeholder="사번을 입력해주세요." size="small"/>
      <RegisterInputField title="주민번호" placeholder="주민번호 입력해주세요." size="small"/>
      <RegisterInputField title="이메일" placeholder="이메일 입력해주세요." size="large"/>
      <RegisterInputField title="전화번호" placeholder="전화번호를 입력해주세요." size="large"/>
    </div>
    <hr>
  </div>
</template>

<style scoped>
hr {
  width: 900px;
  margin: 0;
  height: 2px;
}
#emp-register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3C4651;
  gap: 30px;
}
#register-container-top{
  display: flex;
  align-items: start;
  width: 900px;
  flex-direction: column;
  gap: 20px;
}
.sub-title {
  font-weight: bold;
  font-size: 30px;
  width: 900px;
  margin-top: 20px;
  color: #F37321;
}
</style>