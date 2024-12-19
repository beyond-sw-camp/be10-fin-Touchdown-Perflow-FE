<script setup>
import ButtonBack from "@/components/common/ButtonBack.vue";
import api from "@/config/axios.js";
import {onMounted, ref} from "vue";

const employee = ref({});
let statusText = ref();

const fetchEmp = async () => {
  const response = await api.get("/employees");
  employee.value = response.data;
};
onMounted(async ()=>{
  statusText = document.getElementById('status-text');
  await fetchEmp();
  switch (employee.value.status){
    case "ACTIVE":
      employee.value.status = "재직";
      statusText.classList.add('status-active');
      break;
    case "PENDING":
      employee.value.status = "가입 대기";
      statusText.classList.add('status-pending');
      break;
    case "ON_LEAVE":
      employee.value.status = "휴직";
      statusText.classList.add('status-on-leave');
      break;
    case "SECOND":
      employee.value.status = "파견";
      statusText.classList.add('status-second');
      break;
    case "RESIGNED":
      employee.value.status = "퇴사";
      statusText.classList.add('status-resign');
      break;
  }
});
</script>

<template>
  <div id="my-page-container">
    <div id="title-container">
      <p>마이페이지</p>
      <ButtonBack/>
    </div>
    <div id="info-header-container">
      <p id="name">{{employee.name}}</p>
      <div class="info-header-item"><span class="item-title">부서</span><p>{{employee.deptName}}</p></div>
      <div class="info-header-item"><span class="item-title">직책</span><p>{{employee.jobName}}</p></div>
      <div class="info-header-item"><span class="item-title">상태</span><p id="status-text">{{employee.status}}</p></div>
    </div>
    <div id="middle-line">
      <p id="middle-title">인사정보</p>
      <hr>
    </div>
    <div id="info-main-container">
      <div class="info-header-item"><span class="item-title">연락처</span><p>{{employee.contact}}</p></div>
      <div class="info-header-item"><span class="item-title">이메일</span><p>{{employee.email}}</p></div>
      <div class="info-header-item"><span class="item-title">부서</span><p>{{employee.deptName}}</p></div>
      <div class="info-header-item"><span class="item-title">직책</span><p>{{employee.jobName}}</p></div>
      <div class="info-header-item"><span class="item-title">직위</span><p>{{employee.positionName}}</p></div>
      <div class="info-header-item"><span class="item-title">입사년도</span><p>{{employee.joinDate}}</p></div>
      <div class="info-header-item"><span class="item-title">주소</span><p>{{employee.address}}</p></div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
hr {
  margin: 0;
}
#my-page-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3c4651 ;
}
#title-container, #info-header-container, #info-main-container, #middle-line {
  width: 900px;
  margin-bottom: 50px;
}
#title-container {
  height: 150px;
  display: flex;
  justify-content: space-between;
  padding-top: 50px;
}
#title-container > p {
  font-weight: bold;
  font-size: 35px;
}
#info-header-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
#name {
  font-size: 30px;
  font-weight: bold;
  color: #F37321;
}
.info-header-item {
  display: flex;
  gap: 20px;
}
.item-title {
  font-weight: bold;
  color: black;
}
#middle-title {
  padding-bottom: 20px;
  width: 80px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  border-bottom: 2px solid #F37321;
}
#info-main-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.status-active {
  color: green;
}

.status-resign {
  color: red;
}

.status-pending {
  color: #F37321;
}
.status-second {
  color: #007bff;
}
.status-on-leave {
  color: #DCCDEF;
}
</style>