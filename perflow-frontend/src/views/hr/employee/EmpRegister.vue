<script setup>

import HeaderContainer from "@/components/hr/HeaderContainer.vue";
import RegisterInputField from "@/components/hr/RegisterInputField.vue";
import RrnInputField from "@/components/hr/RrnInputField.vue";
import AddressInputField from "@/components/hr/AddressInputField.vue";
import ButtonDropDown from "@/components/common/ButtonDropDown.vue";
import ButtonBasic from "@/components/common/ButtonBasic.vue"
import {ref} from "vue";

const departments = ref();
const jobs = ref();
const positions = ref();

</script>

<template>
  <div id="emp-register-container">
    <HeaderContainer
      title="구성원"
      flow="구성원 등록"
    />
    <p id="top-title">필수입력</p>
    <div id="register-container-top">
      <RegisterInputField title="사원명" placeholder="사원명을 입력해주세요." size="small"/>
      <RegisterInputField title="사번" placeholder="사번을 입력해주세요." size="small"/>
      <RrnInputField title="주민번호" placeholder1="주민번호 앞자리" placeholder2="주빈번호 뒷자리"/>
      <RegisterInputField title="이메일" placeholder="이메일 입력해주세요." size="large"/>
      <RegisterInputField title="전화번호" placeholder="전화번호를 입력해주세요." size="large"/>
    </div>

    <hr>

    <p id="bottom-title">선택입력</p>
    <div id="register-container-bottom">
      <div class="dropdown-list">
        <div class="dropdown-container">
          <p class="item-title">직급</p><ButtonDropDown default-option="직급을 선택하세요" width="200px" height="40px" font-size="13px"/>
        </div>
        <div class="dropdown-container">
          <p class="item-title">직책</p><ButtonDropDown default-option="직책을 선택하세요" width="200px" height="40px" font-size="13px"/>
        </div>
      </div>
      <div class="dropdown-list">
        <div class="dropdown-container">
          <p class="item-title">부서</p><ButtonDropDown default-option="부서를 선택하세요" width="200px" height="40px" font-size="13px"/>
        </div>
        <div class="dropdown-container">
          <RegisterInputField title="사번" placeholder="사번을 입력해주세요." size="small"/>
        </div>
      </div>
      <AddressInputField/>
      <div class="button-container">
        <ButtonBasic
            size="large"
            color="gray"
            label="취소하기"
        />
        <ButtonBasic
            size="large"
            label="등록하기"
        />
      </div>
    </div>
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
#register-container-bottom{
  display: flex;
  align-items: start;
  width: 900px;
  flex-direction: column;
  gap: 20px;
}
#top-title {
  font-weight: bold;
  font-size: 30px;
  width: 900px;
  margin-top: 20px;
  color: #F37321;
}
#bottom-title {
  font-weight: bold;
  font-size: 30px;
  width: 900px;
  margin-top: 20px;
  color: #3c4651;
}
.dropdown-list {
  display: flex;
  gap: 50px;
}
.dropdown-container {
  display: flex;
  gap: 50px;
  align-items: center;
}
.item-title {
  padding: 0;
  margin: 0;
  font-weight: bold;
}
.button-container {
  display: flex;
  justify-content: space-between;
  padding-left: 200px;
  padding-right: 200px;
  margin-top: 50px;
  width: 900px;
}
</style>