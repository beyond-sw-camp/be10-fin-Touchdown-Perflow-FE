<template>
  <div class="kpi-container">
    <!-- KPI 항목 리스트 -->
    <div v-for="(kpi, index) in KPIs" :key="index" class="kpi-item">
      <!-- 왼쪽: 목표, 목표치, 상태 -->
      <div class="kpi-info">
        <div class="kpi-goal">{{ kpi.goal }}</div>
        <div class="kpi-value">{{ kpi.goalValue }}{{ kpi.goalValueUnit }}</div>
        <div class="kpi-status">{{ getStatusText(kpi.kpiCurrentStatus) }}</div>
      </div>
      <!-- 오른쪽: 버튼 그룹 -->
      <div class="kpi-buttons">
        <!-- 반려 사유 보기 버튼 -->
        <ButtonBasic
            class="btn edit-btn"
            color="gray"
            size="medium"
            :disabled="kpi.kpiCurrentStatus === 'WAIT' || kpi.kpiCurrentStatus === 'APPROVAL'"
            @click="openRejectModal(empId, kpi.kpiId)"
        >
          반려사유보기
        </ButtonBasic>
        <!-- 수정하기 버튼 -->
        <ButtonBasic
            class="btn delete-btn"
            :disabled="kpi.kpiCurrentStatus === 'APPROVAL'"
            @click="openUpdateModal(kpi)"
        >
          수정하기
        </ButtonBasic>
        <!-- 삭제하기 버튼 -->
        <ButtonBasic
            class="btn view-btn"
            :disabled="kpi.kpiCurrentStatus === 'APPROVAL'"
            @click="openDeleteModal(kpi.kpiId)"
        >
          삭제하기
        </ButtonBasic>
      </div>
    </div>

    <!-- KPI 추가하기 버튼 -->
    <div class="add-kpi-container">
      <ButtonBasic class="add-kpi-btn" @click="openAddModal">작성하기</ButtonBasic>
    </div>

    <!-- 반려 사유 모달 -->
    <div v-if="isRejectModalOpen" class="modal-overlay">
      <div class="modal-reject">
        <h3>반려사유</h3>
        <p>{{ rejectReason }}</p>
        <ButtonBasic class="btn close-btn" @click="closeRejectModal">닫기</ButtonBasic>
      </div>
    </div>

    <!-- KPI 수정 모달 -->
    <div v-if="isUpdateModalOpen" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">KPI 수정하기</h2>

        <div class="form-group">
          <label for="goal">목표</label>
          <input id="goal" type="text" v-model="KPIForm.goal" placeholder="목표를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="goalValue">목표치</label>
          <input id="goalValue" type="number" v-model="KPIForm.goalValue" placeholder="목표치를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="goalUnit">목표치 단위</label>
          <input id="goalUnit" v-model="KPIForm.goalValueUnit" placeholder="목표치단위를 입력하세요">
        </div>

        <div class="form-group">
          <label for="goalDescription">목표 세부설명</label>
          <textarea
              id="goalDescription"
              v-model="KPIForm.goalDetail"
              placeholder="목표에 대한 세부설명을 입력하세요"
          ></textarea>
        </div>

        <div class="modal-actions">
          <ButtonBasic class="btn cancel-btn" @click="closeUpdateModal">취소</ButtonBasic>
          <ButtonBasic class="btn save-btn"
                  :disabled="!KPIForm.goal || !KPIForm.goalValue || !KPIForm.goalValueUnit || !KPIForm.goalDetail"
                  @click="updateKPI">
            저장
          </ButtonBasic>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div v-if="isDeleteModalOpen" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">정말 삭제하시겠습니까?</h2>
        <div class="modal-actions">
          <ButtonBasic class="btn cancel-btn" @click="closeDeleteModal">취소</ButtonBasic>
          <ButtonBasic class="btn delete-btn" @click="confirmDelete(empId)">삭제</ButtonBasic>
        </div>
      </div>
    </div>

    <!-- KPI 추가 모달 -->
    <div v-if="isAddModalOpen" class="modal-overlay">
      <div class="modal-container">
        <h2 class="modal-title">KPI 작성하기</h2>

        <div class="form-group">
          <label for="goal">목표</label>
          <input id="goal" type="text" v-model="KPIForm.goal" placeholder="목표를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="goalValue">목표치</label>
          <input id="goalValue" type="number" v-model="KPIForm.goalValue" placeholder="목표치를 입력하세요" />
        </div>

        <div class="form-group">
          <label for="goalUnit">목표치 단위</label>
          <input id="goalUnit" v-model="KPIForm.goalValueUnit" placeholder="목표치단위를 입력하세요"/>
        </div>

        <div class="form-group">
          <label for="goalDescription">목표 세부설명</label>
          <textarea
              id="goalDescription"
              v-model="KPIForm.goalDetail"
              placeholder="목표에 대한 세부설명을 입력하세요"
          ></textarea>
        </div>

        <div class="modal-actions">
          <ButtonBasic class="btn cancel-btn" @click="closeAddModal">취소</ButtonBasic>
          <ButtonBasic class="btn save-btn"
                  :disabled="!KPIForm.goal || !KPIForm.goalValue || !KPIForm.goalValueUnit || !KPIForm.goalDetail"
                  @click="addKPI">
            저장
          </ButtonBasic>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/config/axios.js";
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import {useAuthStore} from "@/store/authStore.js";

// 반응형 데이터
const KPIs = ref([]);
const isRejectModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isAddModalOpen = ref(false);
const rejectReason = ref("");
const KPIForm = ref({
  kpiId: "",
  goal: "",
  goalValue: "",
  goalValueUnit: "",
  goalDetail: "",
});
const authStore = useAuthStore();

const empId = authStore.empId;

const deleteIndex = ref(null);

// KPI 데이터 가져오기
const fetchKpiList = async (empId) => {
  try {
    const response = (await api.get(`/perfomances/kpi/personal/${empId}`)).data;
    KPIs.value = response.kpiLists;
  } catch (error) {
    console.error("KPI 데이터를 받아오는데 실패했습니다.", error);
  }
};

// 반려 사유 가져오기
const fetchRejectReason = async (empId, kpiId) => {
  try {
    const response = (await api.get(`/perfomances/kpi/reject/${empId}/${kpiId}`)).data;
    rejectReason.value = response.reason;
  } catch (error) {
    console.error("반려 사유를 받아오는데 실패했습니다.", error);
  }
};

// KPI 추가하기
const addKPIdata = async (empId) => {
  const addKPI = {
    goal: KPIForm.value.goal,
    goalValue: KPIForm.value.goalValue,
    goalValueUnit: KPIForm.value.goalValueUnit,
    goalDetail: KPIForm.value.goalDetail,
  };

  try {
    const response = (await api.post(`/perfomances/kpi/personal/${empId}`, addKPI)).data;
    console.log("KPI 저장 성공:", response);
    fetchKpiList(empId); // 수정 후 목록 갱신
  } catch (error) {
    console.error("KPI 저장 실패:", error);
  }
};

// KPI 수정하기
const updateKPIdata = async (kpiId) => {
  const updatedKPI = {
    status: "WAIT",
    goal: KPIForm.value.goal,
    goalValue: KPIForm.value.goalValue,
    goalValueUnit: KPIForm.value.goalValueUnit,
    goalDetail: KPIForm.value.goalDetail,
  };

  try {
    const response = (await api.put(`/perfomances/kpi/personal/${kpiId}`, updatedKPI)).data;
    console.log("KPI 수정 성공:", response);
    fetchKpiList(empId); // 수정 후 목록 갱신
  } catch (error) {
    console.error("KPI 수정 실패:", error);
    alert("삭제 작업에 실패했습니다. 다시 시도해 주세요.");
  }
};

// KPI 삭제하기
const deleteKPIdate = async (kpiId, empId) => {
  try {
    const response = (await api.delete(`/perfomances/kpi/personal/${kpiId}/${empId}`)).data;
    console.log("KPI 삭제 성공:", response);
    fetchKpiList(empId); // 수정 후 목록 갱신
  } catch (error) {
    console.error("KPI 삭제 실패:", error);
  }
}

// 반려 사유 모달 열기
const openRejectModal = async (empId, kpiId) => {
  await fetchRejectReason(empId, kpiId);
  isRejectModalOpen.value = true;
};

// 반려 사유 모달 닫기
const closeRejectModal = () => {
  isRejectModalOpen.value = false;
  rejectReason.value = "";
};

// 수정 모달 열기
const openUpdateModal = (kpi) => {
  KPIForm.value = {...kpi};
  isUpdateModalOpen.value = true;
};

// 수정 모달 닫기
const closeUpdateModal = () => {
  isUpdateModalOpen.value = false;
};

// 삭제 확인 모달 열기
const openDeleteModal = (kpiId) => {
  deleteIndex.value = kpiId;
  console.log(kpiId);
  isDeleteModalOpen.value = true;
};

// 삭제 확인 모달 닫기
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteIndex.value = null;
};

// 삭제 확인
const confirmDelete = (empId) => {
  deleteKPIdate(deleteIndex.value, empId);
  closeDeleteModal();
};

// KPI 추가 모달 열기
const openAddModal = () => {
  resetKPIForm();
  isAddModalOpen.value = true;

};

// KPI 추가 모달 닫기
const closeAddModal = () => {
  isAddModalOpen.value = false;
};

// 수정 데이터 저장
const updateKPI = () => {
  updateKPIdata(KPIForm.value.kpiId);
  console.log("수정된 KPI 데이터:", KPIForm.value);
  closeUpdateModal();
};

// 작성 데이터 저장
const addKPI = () => {
  addKPIdata(empId);
  console.log("저장된 KPI 데이터:", KPIForm.value);
  closeAddModal();
};

// KPIForm 초기화
const resetKPIForm = () => {
  KPIForm.value = {
    kpiId: "",
    goal: "",
    goalValue: "",
    goalValueUnit: "",
    goalDetail: "",
  };
};

// 상태 변환 함수
const getStatusText = (status) => {
  switch (status) {
    case "WAIT":
      return "대기";
    case "APPROVAL":
      return "승인";
    case "REJECT":
      return "반려";
    default:
      return "알 수 없음";
  }
};

// 데이터 가져오기 실행
onMounted(() => fetchKpiList(empId));
</script>

<style scoped>
.kpi-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 항목 간 간격 */
  padding: 10px;
}

/* KPI 항목 스타일 */
.kpi-item {
  width: 900px;
  display: flex;
  justify-content: space-between; /* 좌우 요소 간격 */
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.kpi-info {
  display: flex;
  flex-direction: row;
  gap: 50px;
  justify-content: space-between; /* 양 끝 요소를 정렬 */
}

.kpi-goal,
.kpi-value,
.kpi-status {
  flex: 0 0 150px; /* 각 요소의 너비를 고정 (150px) */
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.kpi-goal {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.kpi-value,
.kpi-status {
  font-size: 14px;
  color: #666;
}

/* 버튼 그룹 */
.kpi-buttons {
  display: flex;
  gap: 10px;
}

.add-kpi-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.add-kpi-btn {
  background: linear-gradient(to right, #ff9900, #ffcc33);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.add-kpi-btn:hover {
  opacity: 0.8;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: linear-gradient(to right, #ff9900, #ffcc33);
  color: white; /* 주황색 */
}

.btn:disabled {
  background-color: #ccc !important; /* 회색 비활성화 색상 */
  cursor: not-allowed;
  opacity: 0.6; /* 약간의 투명도 추가 */
  background-image: none !important; /* 그라데이션 제거 */
}

.btn:hover {
  opacity: 0.8;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-reject,
.modal-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

textarea {
  resize: none;
  height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  background: linear-gradient(to right, #ff9900, #ffcc33);
  color: white; /* 주황색 */
}
</style>
