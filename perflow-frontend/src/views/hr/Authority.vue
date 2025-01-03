<script setup>

import HeaderContainer from "@/components/hr/HeaderContainer.vue";
import api from "@/config/axios.js";
import {computed, onMounted, ref} from "vue";
import SlideToggle from "@/components/common/SlideToggle.vue";
import {useStore} from "@/store/store.js";
import SearchBar from "@/components/common/SearchBar.vue";

const employees = ref([]);
const selectedEmpId = ref(null);
const store = useStore();
// 선택된 사원 객체 계산
const selectedEmp = computed(() => {
  return employees.value.find(emp => emp.empId === selectedEmpId.value) || null;
});

const updateSelectedEmpId = (empId) => {
  selectedEmpId.value = empId;
}

// 권한을 체크하는 함수
const checkAuth = (number) => {
  if (!selectedEmp.value || !selectedEmp.value.authorities) return false;
  return selectedEmp.value.authorities.includes(number);
};
// 사원 목록 조회
const fetchEmpList = async () => {

  const response = (await api.get("/employees/lists", {
    params: {
      page: 1,
      size: 10000
    }
  })).data;
  employees.value = response.employeeList;
}

// 사원 목록 검색
const fetchEmpListByName = async (name) => {
  const response = (await api.get("/employees/lists/search", {
    params: {
      page: 1,
      size: 10000,
      name: name
    }
  })).data;
  employees.value = response.employeeList;
}
const updateAuthority = async (checked, authId) => {

  try{
      store.showLoading()
    if(checked) {
      await api.post("/master/auth",{
        empId : selectedEmpId.value,
        authorityId : authId
      });
      alert("권한 부여 성공!")
    } else {
      await api.delete("/master/auth",{
        data:{
          empId : selectedEmpId.value,
          authorityId : authId
        }
      });
      alert("권한 회수 성공!")
    }
    await fetchEmpList();
    store.hideLoading();
  } catch (error) {
    const errorMessage = error.response.data.message;
    // "ExceptionHandlerExceptionResolver" 오류를 무시
    if (errorMessage.includes("The given")) {
      console.warn("ExceptionHandlerExceptionResolver 오류는 무시되었습니다.");
      return; // 오류 무시
    }
    if (errorMessage){
      store.hideLoading()
      alert(errorMessage);
    } else {
      alert("권한 수정 중 오류가 발생했습니다.")
    }
  }
}

onMounted(()=>{
  fetchEmpList();
});
</script>

<template>
  <div id="authority-container">
    <HeaderContainer title="권한 관리"/>
    <div id="menu"><p class="menu-list">사원 목록</p><p class="menu-list">권한목록</p></div>
    <div id="main-container">
      <div id="emp-list">
        <SearchBar width="220x" font-size="15px" placeholder="사원명" @search="fetchEmpListByName"/>
        <div v-for="emp in employees" id="emp" @click="updateSelectedEmpId(emp.empId)" :class="{ selected: emp.empId === selectedEmpId }">
          <p class="emp-id">{{emp.empId}}</p>
          <p class="emp-name">{{emp.name}}</p>
        </div>
      </div>
      <div id="authority-list">
        <div class="authority" v-if="selectedEmpId">
          <p class="auth-name">사원</p>
          <SlideToggle :model-value="checkAuth(1)" @change="updateAuthority" id=1 />
        </div>
        <div class="authority" v-if="selectedEmpId">
          <p class="auth-name">팀장</p>
          <SlideToggle :model-value="checkAuth(2)" @change="updateAuthority" id=2 />
        </div>
        <div class="authority" v-if="selectedEmpId">
          <p class="auth-name">인사관리자</p>
          <SlideToggle :model-value="checkAuth(3)" @change="updateAuthority" id=3 />
        </div>
        <div class="authority" v-if="selectedEmpId">
          <p class="auth-name">마스터</p>
          <SlideToggle :model-value="checkAuth(4)" @change="updateAuthority" id=4 />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  margin: 0;
}
#authority-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#main-container {
  width: 900px;
  display: flex;
  gap: 100px;
  margin-top: 20px;
}
#emp-list {
  width: 300px;
  height: 500px;
  border: 1px solid #D9D9D9;
  padding: 30px;
  font-size: 18px;
  border-radius: 10px;

}
#authority-list {
  width: 500px;
  height: 300px;
  border: 1px solid #D9D9D9;
  border-radius: 10px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  justify-content: center;
}
#emp {
  display: flex;
  gap: 20px;
  cursor: pointer;
  height: 40px;
  align-items: center;
  padding: 5px;
}
#emp:hover {
  background-color: #D9D9D9;
}
.emp-id {
  width: 150px;
}
.emp-name {
  width: 150px;
}
.selected {
  background-color: #D9D9D9;
}
.auth-name {
  font-weight: bold;
  font-size: 20px;
  width: 150px;
}
.authority {
  display: flex;
  gap: 100px;
}
#menu {
  display: flex;
  width: 900px;
  margin-top: 20px;
}
.menu-list {
  width: 400px;
  margin: 0;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
}
</style>