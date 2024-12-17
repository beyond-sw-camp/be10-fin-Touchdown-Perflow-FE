<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import { ref } from "vue";
import OrganizationTree from "@/components/common/OrganizationTree.vue";
import ApprovalButtonGroup from "@/components/common/ApprovalButtonGroup.vue";
import ApprovalList from "@/components/common/ApprovalList.vue";

// 모달 상태
const isModalOpen = ref(false);
const selectedEmployees = ref([]); // 체크된 사원 목록
const approvalList = ref([]); // 결재 목록

// 모달 열기/닫기
const openModal = () => (isModalOpen.value = true);
const closeModal = () => (isModalOpen.value = false);

// 설정 저장
const saveSettings = () => {
  alert("설정이 저장되었습니다!");
  closeModal();
};

// 사원 업데이트 이벤트 핸들러
const updateSelectedEmployees = (employees) => {
  selectedEmployees.value = employees;
};

// ApprovalButtonGroup에서 데이터를 받아 결재 목록에 추가
const addToApprovalList = (newApprovals) => {
  approvalList.value.push(...newApprovals);
};
</script>

<template>
  <div class="main-container">
    <div class="form-container">
      <!-- 제목 -->
      <InputField
          v-model="title"
          label="제목"
          placeholder="제목을 입력해 주세요."
          :isRequired="true"
      />

      <!-- 내용 -->
      <InputField
          v-model="content"
          label="내용"
          placeholder="내용을 입력해 주세요."
          type="textarea"
          :isRequired="true"
          height="300px"
      />

      <div class="button-group">
        <ButtonBasic
            color="gray"
            size="medium"
            label="취소하기"
            @click="closeModal"
        />
        <ButtonBasic
            color="orange"
            size="medium"
            label="상신하기"
            @click="saveSettings"
        />
      </div>
    </div>

    <!-- 결재선 -->
    <div class="box-container">
      <ApprovalShareBox
          title="결재선"
          placeholder="결재선이 없습니다."
          @onSettingsClick="openModal"
      />

      <!-- 모달 창 -->
      <ModalBasic
          :isOpen="isModalOpen"
          title="결재선 설정"
          width="1000px"
          :button1="{ label: '닫기', color: 'gray', onClick: closeModal }"
          :button2="{ label: '저장하기', color: 'orange', onClick: saveSettings }"
          @close="closeModal"
      >
        <template #default>
          <div class="modal-layout">
            <!-- 조직도 트리 -->
            <div class="modal-box left">
              <OrganizationTree @update:selectedEmployees="updateSelectedEmployees" />
            </div>

            <!-- 결재 버튼 그룹 -->
            <div class="modal-box center">
              <ApprovalButtonGroup
                  :selectedEmployees="selectedEmployees"
                  @addApproval="addToApprovalList"
              />
            </div>

            <!-- 결재 목록 -->
            <div class="modal-box right">
              <ApprovalList :approvalList="approvalList" />
            </div>
          </div>
        </template>
      </ModalBasic>
      <!-- 공유 -->
      <ApprovalShareBox
          title="공유"
          placeholder="공유처가 없습니다."
          @onSettingsClick="() => handleSettingsClick('공유')"
      />
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px;
  height: 100vh;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 400px;
}

.box-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
}

/* 모달 내부 레이아웃 */
.modal-layout {
  display: flex;
  gap: 10px;
  height: 300px;
}

/* 모달 내부 박스 공통 스타일 */
.modal-box {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
}

.left {
  border-right: 1px solid #ccc;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right {
  background-color: #f9f9f9;
}
</style>
