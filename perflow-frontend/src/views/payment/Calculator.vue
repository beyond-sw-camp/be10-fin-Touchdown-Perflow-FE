<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/axios.js";

const employee = ref(null);
const resignDate = ref(null);
const annualAllowance = ref(null);
const pay = ref(null);
const allowance = ref(null);
const monthPay = ref(null);
const dayPay = ref(null);
const totalSeverance = ref(null);

const handleRest = () => {

}

// 사원 정보를 가져오는 함수
const fetchEmp = async () => {
  try {
    const response = await api.get(`/employees`);
    employee.value = response.data;
  } catch (error) {
    console.log('사원 정보를 불러오는 중 에러가 발생했습니다. : ',error);
  }
};

onMounted(() => {
  fetchEmp();
})
</script>

<template>
  <div class="container">
    <div class="title">
      <p>예상 퇴직금 계산기</p>
      <button
          class="btn"
          @click="handleRest"
      >
        초기화
      </button>
    </div>
    <div class="date">
      <div class="join">
        <p>입사일</p>
        <div class="join-date">
          {{ employee?.joinDate }}
          <img src="../../assets/image/calendar.png" alt="calendar" />
        </div>
      </div>
      <div class="join">
        <p>퇴사일</p>
        <input
          class="date-input"
          type="date"
        />
      </div>
    </div>
    <div class="allowance">
      <p>기타 수당(선택)</p>
      <div class="annual-allowance">
        <p>연차수당</p>
        <div class="annual-input">{{  }}원</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 900px;
  margin-top: 30px;
}

.title p {
  color: #3C4651;
  font-size: 35px;
  font-weight: bold;
  margin: 0;
}

.btn {
  width: 80px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  color: white;
  background-image: linear-gradient(to right, #f37321 0%, #fb0 100%);
}

.date {
  width: 900px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin: 50px;
}

.join {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 30px;
}

.join p {
  font-size: 25px;
  color: #3C4651;
  margin: 0;
}

.join-date {
  align-content: center;
  width: 200px;
  height: 30px;
  border: 1px solid #afa9a9;
  border-radius: 10px;
  padding-left: 10px;
  color: #afa9a9;
}

.join-date img {
  width: 25px;
  height: 25px;
  margin-left: 70px;
}

.date-input {
  width: 200px;
  height: 30px;
  border: 1px solid #afa9a9;
  border-radius: 10px;
  font-size: 16px;
  color: #3C4651;
  padding-left: 10px;
}

.allowance {
  display: flex;
  flex-direction: column;
  width: 900px;
}

.allowance p {
  font-size: 28px;
  color: #3C4651;
  font-weight: bold;
}

.annual-allowance {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}

.annual-allowance p {
  font-size: 25px !important;
  font-weight: normal !important;
  margin-right: 30px;
}

.annual-input {
  font-size: 20px;
  color: #3C4651;
  border: 1px solid #afa9a9;
  border-radius: 10px;
  align-content: center;
  width: 200px;
  height: 30px;
  justify-content: space-between;
}

</style>