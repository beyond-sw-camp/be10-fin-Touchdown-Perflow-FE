<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import { ref } from "vue";
import OrganizationTree from "@/components/common/OrganizationTree.vue";
import draggable from "vuedraggable";

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

const selectedRows = ref(new Set());

// 체크박스 선택/해제 핸들러
const toggleRowSelection = (index) => {
  if (selectedRows.value.has(index)) {
    selectedRows.value.delete(index); // 이미 선택된 경우 해제
  } else {
    selectedRows.value.add(index); // 선택 안 된 경우 추가
  }
};

// 선택된 행 삭제
const deleteSelectedRows = () => {
  approvalList.value = approvalList.value.filter(
      (_, index) => !selectedRows.value.has(index)
  );
  selectedRows.value.clear(); // 선택 목록 초기화
};


// 사원 업데이트 이벤트 핸들러
const updateSelectedEmployees = (employees) => {
  console.log("선택된 사원 목록: ", selectedEmployees);
  selectedEmployees.value = employees;
};

// 버튼 클릭 시 결재 순서에 추가
const addToApprovalList = (type) => {
  const newApprovals = selectedEmployees.value.map((emp) => ({
    type, // 결재 방식
    name: emp.name, // 사원 이름
    position: emp.position, // 직위
  }));
  approvalList.value.push(...newApprovals);
  selectedEmployees.value = []; // 선택된 사원 목록 초기화
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
              <div class="button-group">
                <ButtonBasic
                    label="결재"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('결재')"
                />
                <ButtonBasic
                    label="참조"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('참조')"
                />
                <ButtonBasic
                    label="합의"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('합의')"
                />
                <ButtonBasic
                    label="병렬 합의"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('병렬 합의')"
                />
              </div>
            </div>

            <!-- 결재 목록 -->
            <div class="modal-box right">
              <h3>결재 순서</h3>
              <table class="approval-table">
                <!-- 테이블 헤더 -->
                <thead>
                <tr>
                  <th>순서</th>
                  <th>결재 종류</th>
                  <th>이름</th>
                  <th>직위</th>
                </tr>
                </thead>

                <!-- 드래그 가능한 테이블 바디 -->
                <draggable
                    v-model="approvalList"
                    tag="tbody"
                    item-key="name"
                >
                  <template #item="{ element, index }">
                    <tr
                        @click="toggleRowSelection(index)"
                        :class="{ 'selected-row': selectedRows.has(index) }"
                    >
                      <td>{{ index + 1 }}</td>
                      <td>{{ element.type }}</td>
                      <td>{{ element.name }}</td>
                      <td>{{ element.position }}</td>
                    </tr>
                  </template>
                </draggable>
              </table>
              <ButtonBasic
                  label="삭제"
                  color="white"
                  size="small"
                  @click="deleteSelectedRows"
              />
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
  flex-direction: column; /* 버튼 위아래 정렬 */
  gap: 10px;  /* 버튼 간 간격 */
  align-items: center;  /* 중앙 정렬 */
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

.approval-table {
  width: 100%;
  border-collapse: collapse;  /* 테두리 겹치기 */
}

.approval-table th,
.approval-table td {
  border-top: 1px solid #ddd; /* 가로선만 */
  padding: 8px;
  text-align: center;
}

.approval-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

/* 선택된 행 */
.selected-row {
  background-color: #f0f0f0; /* 클릭 시 회색 배경 적용 */
  cursor: pointer;
}
</style>
