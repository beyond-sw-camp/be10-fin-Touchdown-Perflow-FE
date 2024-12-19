<script setup>
import {ref, onMounted, computed } from "vue";
import api from "@/config/axios.js";
import { useRouter } from "vue-router";
import MainPageButton from "@/components/common/MainPageButton.vue";
import TableMini from "@/components/common/TableMini.vue";
import { useAuthStore } from "@/store/authStore.js";

const router = useRouter();
const authStore = useAuthStore();
const employee = ref(null);
const commute = ref(null);
const attendance = ref(null);
const annual = ref(null);
const payDate = ref(null);
const vacation = ref([]);
const teamKPI = ref([]);
const personalKPI = ref([]);
const announcement = ref(null);
const waitingApproval = ref(null);

const waitingApprovalCount = ref(0);
const empId = authStore.empId;

// 사원 정보를 가져오는 함수
const fetchEmp = async () => {
  try {
    const response = await api.get(`/employees`);
    employee.value = response.data;
  } catch (error) {
    console.error('사원 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 출퇴근 정보를 가져오는 함수
const fetchCommute = async () => {
  try {
    const response = await api.get(``);
    commute.value = response.data;
  } catch (error) {
    console.error('출퇴근 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 일주일 총 근무시간 정보를 가져오는 함수
const fetchAttendance = async () => {
  try {
    const response = await api.get(`/emp/attendance/summaries/weekly`);
    attendance.value = response.data;
  } catch (error) {
    console.error('일주일 총 근무시간 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 연차 정보를 가져오는 함수
const fetchAnnual = async () => {
  try {
    const response = await api.get(``);
    annual.value = response.data;
  } catch (error) {
    console.error('연차 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 급여일 정보를 가져오는 함수
const fetchPayDate = async () => {
  try {
    const response = await api.get(`/company`);
    payDate.value = response.data;
  } catch (error) {
    console.error('급여일 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 휴가 정보를 가져오는 함수
const fetchVacation = async () => {
  try {
    const response = await api.get(``);
    vacation.value = response.data;
  } catch (error) {
    console.error('휴가 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 팀 kpi 정보를 가져오는 함수
const fetchTeamKPI = async () => {
  try {
    const response = await api.get(`/leader/perfomances/kpi/team/${empId}`);
    teamKPI.value = response.data.kpiLists;
  } catch (error) {
    console.error('팀 kpi 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 개인 kpi 정보를 가져오는 함수
const fetchPersonalKPI = async () => {
  try {
    const response = await api.get(`perfomances/kpi/personal/${empId}`);
    personalKPI.value = response.data.kpiLists;
  } catch (error) {
    console.error('개인 kpi 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 공지사항 정보를 가져오는 함수
const fetchAnnouncement = async () => {
  try {
    const response = await api.get(`/announcements`);
    announcement.value = response.data.content;
  } catch (error) {
    console.error('공지사항 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

// 대기 문서 정보를 가져오는 함수
const fetchWaitingApproval = async () => {
  try {
    const response = await api.get(`/approval/waiting-docs`);
    waitingApproval.value = response.data.content;
    // docId의 개수를 셈
    waitingApprovalCount.value = waitingApproval.value.filter(doc => doc.docId).length;
  } catch (error) {
    console.error('대기 문서 정보를 불러오는 중 에러가 발생했습니다. : ', error);
  }
};

const goToKPI = () => {
  router.push(``)
};

const goToAnnouncement = () => {
  router.push(`/announcements`)
};

const goToApproval = () => {
  router.push(`/approval/home`)
};

const goToWaiting = () => {
  router.push(`/approval/waiting`)
};

const goToProcessed = () => {
  router.push(``)
}

const kpiRows = computed(() => {
  // 팀 데이터와 개인 데이터를 합쳐서 하나의 배열로 반환
  const allData = [...teamKPI.value, ...personalKPI.value];

  // 진척도 계산 및 데이터 생성
  const mappedData = allData.map((item) => {
    const progress = item.goalValue > 0 ? (item.currentValue / item.goalValue) * 100 : 0;
    const category = item.personalType === "TEAM" ? "팀" : "개인";

    return {
      category: category,
      goal: item.goal,
      targetValue: `${item.goalValue}${item.goalValueUnit}`,
      progress: `${Math.round(progress)}%`,
    };
  });

  // '팀' 데이터가 위로 오도록 정렬
  return mappedData.sort((a, b) => {
    if (a.category === "팀" && b.category !== "팀") {
      return -1; // '팀'이 우선
    }
    if (a.category !== "팀" && b.category === "팀") {
      return 1; // '개인'이 나중
    }
    return 0; // 순서 유지
  });
});

const kpiColumns = [
  { field: 'category',    label: '구분' },
  { field: 'goal',        label: '제목' },
  { field: 'targetValue', label: '목표치' },
  { field: 'progress',    label: '진척도' }
];

const annRows = computed(() => {
  const ann = Array.isArray(announcement.value) ? announcement.value : [];
  return ann.map((item) => ({
    ...item,
    title: truncateTitle(item.title),
    createDatetime: formatDate(item.createDatetime),
  }))
      .sort((a, b) => new Date(b.createDatetime) - new Date(a.createDatetime)); // 작성일 기준 최신순 정렬
});

// title이 10자 이상일 경우 ... 추가하는 함수
const truncateTitle = (title) => {
  return title.length > 8 ? title.substring(0, 8) + '...' : title;
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  return `${dateString.slice(0, 4)}.${dateString.slice(5, 7)}.${dateString.slice(8, 10)}`;
};

const annColumns = [
  { field: 'title',          label: '제목' },
  { field: 'deptName',       label: '부서명' },
  { field: 'createDatetime', label: '작성일' }
];

onMounted(() => {
  fetchEmp();
  // fetchCommute();
  fetchAttendance();
  // fetchAnnual();
  fetchPayDate();
  // fetchVacation();
  fetchTeamKPI();
  fetchPersonalKPI();
  fetchAnnouncement();
  fetchWaitingApproval();
})

</script>

<template>
  <div class="container">
    <!-- 프로필 및 출퇴근 정보 -->
    <div class="emp-info">
      <div class="emp">
        <h3>{{ employee?.deptName }}</h3>
        <div class="profile">
          <h2>{{ employee?.name }}</h2>
          <h4>{{ employee?.positionName }}</h4>
        </div>
      </div>
      <div class="commute">
        <h4>출퇴근</h4>
        <h5>현재 날짜</h5>
        <div class="time">
          <img src="../assets/image/work_on.png" alt="on"/>
          <p>6시간 10분</p>
        </div>
        <div class="button">
          <MainPageButton
            color="gray"
            label="ON"
            @click="handleOn"
          />
          <MainPageButton
            color="orange"
            label="OFF"
            @click="handleOff"
          />
        </div>
      </div>
    </div>
    <!-- 근무시간, 남은 연차, 남은 급여일 정보 -->
    <div class="period">
      <div class="attendance">
        <img src="../assets/image/alarm.png" alt="clock" />
        <h4>근무시간</h4>
        <p>{{ attendance?.totalHours }}31시간 {{ attendance?.totalMinutes }}50분 </p>
      </div>
      <div class="annual">
        <img src="../assets/image/travel.png" alt="plane" />
        <h4>남은 연차</h4>
        <p>11일</p>
      </div>
      <div class="pay">
        <img src="../assets/image/payments.png" alt="money" />
        <h4>남은 급여일</h4>
        <p>28일전</p>
      </div>
    </div>
    <!-- 예정 휴가, kpi 정보 -->
    <div class="goal">
      <div class="vacation">
        <div class="vacation-title">
          <h2>예정 휴가</h2>
          <h3>2</h3>
        </div>
        <div class="vacation-list">
          <img src="../assets/image/luggage.png" alt="luggage" />
          <p>연차</p>
          <h4>2024.12.19</h4>
          <div class="vacation-box">
            <p>1일</p>
          </div>
        </div>
        <div class="vacation-list">
          <img src="../assets/image/beach.png" alt="beach" />
          <p>휴가</p>
          <h4>2024.12.23</h4>
          <div class="vacation-box">
            <p>5일</p>
          </div>
        </div>
      </div>
      <div class="kpi">
        <div class="kpi-title">
          <Button @click="goToKPI">
            KPI
            <img src="../assets/image/left.png" alt="left"/>
          </Button>
        </div>
        <TableMini
            row-key="id"
            :rows="kpiRows"
            :columns="kpiColumns"
        />
      </div>
    </div>
    <!-- 공지사항, 결재문서 -->
    <div class="ann">
      <div class="announcement">
        <div class="announcement-title">
          <Button @click="goToAnnouncement">
            공지사항
            <img src="../assets/image/left.png" alt="left" />
          </Button>
        </div>
        <TableMini
            row-key="id"
            :rows="annRows"
            :columns="annColumns"
        />
      </div>
      <div class="approval">
        <div class="approval-title">
          <Button @click="goToApproval">
            결재문서
            <img src="../assets/image/left.png" alt="left" />
          </Button>
        </div>
        <div class="waiting">
          <div class="stat-item-a" @click="goToWaiting">
            <h4>대기문서</h4>
            <p>{{ waitingApprovalCount }}</p>
          </div>
          <div class="stat-item-b" @click="goToProcessed">
            <h4>처리문서</h4>
            <p>1</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 컨테이너 스타일 */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;
}

/* 사원 정보 섹션 */
.emp-info {
  display: flex;
  justify-content: space-between;
  width: 900px;
  background-color: white;
  height: 250px;
}

.emp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
}

.emp h3 {
  font-size: 24px;
  color: #afa9a9;
}

.profile {
  display: flex;
  margin-top: 10px;
}

.profile h2 {
  font-size: 30px;
  margin-right: 13px;
  color: #3C4651;
  font-weight: bold;
}

.profile h4 {
  font-size: 18px;
  color: #afa9a9;
  margin-top: 12px;
}

.commute {
  display: flex;
  flex-direction: column;
  width: 450px;
  background-color: white;
  border: 1px solid #afa9a9;
  border-radius: 10px;
}

.commute h4 {
  font-size: 20px;
  font-weight: bold;
  color: #3C4651;
  margin: 20px 0 10px 25px;
}

.commute h5 {
  font-size: 15px;
  color: #888888;
  margin-left: 25px;
}

.commute .time {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
  height: 70px;
}

.time img {
  width: 30px;
  height: 20px;
  margin-bottom: 15px;
}

.time p {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #3C4651;
  font-weight: bold;
}

.button {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  margin: 17px 50px 20px 50px;
}

/* 근무시간, 남은 연차, 남은 급여일 섹션 */
.period {
  display: flex;
  justify-content: space-between;
  width: 900px;
  gap: 100px;
  margin-top: 40px;
}

.period div {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #afa9a9;
  padding: 15px;
  height: 160px;
}

.period img {
  width: 30px;
  height: 30px;
  margin-bottom: 25px;
}

.period h4 {
  font-size: 13px;
  color: #afa9a9;
  margin-top: 15px;
}

.period p {
  font-size: 23px;
  color: #3C4651;
  margin: 0;
}

/* KPI 및 휴가 섹션 */
.goal {
  display: flex;
  justify-content: space-between;
  width: 900px;
  margin-top: 40px;
}

.vacation {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 400px;
  margin-top: 5px;
}

.vacation-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.vacation-title h2 {
  font-size: 25px;
  color: #3C4651;
  font-weight: bold;
  margin-right: 15px;
}

.vacation-title h3 {
  font-size: 25px;
  color: #05A730;
  font-weight: bold;
}

.vacation-list {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 15px;
}

.vacation-list img {
  width: 30px;
  height: 30px;
}

.vacation-list p {
  color: #3C4651;
  font-size: 20px;
  padding: 0;
  margin: 0;
}

.vacation-list h4 {
  color: #afa9a9;
  font-size: 20px;
  padding: 0;
  margin: 3px 0 0 0;
}

.vacation-box {
  border-radius: 10px;
  border: 1px solid #afa9a9;
  text-align: center;
  width: 55px;
  font-weight: bold;
}

.vacation ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.vacation li {
  margin: 5px 0;
  font-size: 20px;
  color: #3C4651;
}

.kpi {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 400px;
}

.kpi-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.kpi-title button {
  border: none;
  background: none;
  cursor: pointer;
  color: #3C4651;
  font-size: 25px;
  font-weight: bold;
  padding: 0;
}

.kpi-title img {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

/* 공지사항 및 결재문서 섹션 */
.ann {
  display: flex;
  justify-content: space-between;
  width: 900px;
  gap: 20px;
  margin-top: 40px;
  height: 400px;
}

.announcement {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 400px;
}

.announcement-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.announcement button {
  border: none;
  background: none;
  cursor: pointer;
  color: #3C4651;
  font-size: 25px;
  font-weight: bold;
  padding: 0;
}

.announcement img {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.approval {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 400px;
}

.approval button {
  border: none;
  background: none;
  cursor: pointer;
  color: #3C4651;
  font-size: 25px;
  font-weight: bold;
  padding: 0;
}

.approval-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.approval img {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.waiting {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.stat-item-a {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px 0 0 10px;
  padding: 15px;
  border: 1px solid #afa9a9;
  border-right: none; /* 오른쪽 테두리 제거 */
  height: 270px;
  cursor: pointer;
}

.stat-item-b {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0 10px 10px 0;
  padding: 15px;
  border: 1px solid #afa9a9;
  height: 270px;
  cursor: pointer;
}

.stat-item h4 {
  font-size: 18px;
  color: #3C4651;
  font-weight: bold;
}

.stat-item-a p, .stat-item-b p {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 143px;
  padding: 0;
  font-size: 50px;
  color: #F37321;
}
</style>