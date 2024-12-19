<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import {ref} from "vue";
import OrganizationTree from "@/components/common/OrganizationTree.vue";
import draggable from "vuedraggable";

const selectedApprovalEmployees = ref([]); // 체크된 사원 목록
const selectedShareEmployees = ref([]); // 체크된 사원 목록

const approvalList = ref([]); // 결재 목록
const approvalData = ref([]);  // approvalShareBox 에 전달할 데이터

const shareList = ref([]);  // 공유 목록
const shareData = ref([]);  // 모달에서 선택한, approvalShareBox 에 전달할 데이터


// 모달 상태
const isApprovalModalOpen = ref(false);
const isShareModalOpen = ref(false);  // 공유 모달 상태

// 모달 열기/닫기
const openApprovalModal = () => (isApprovalModalOpen.value = true);
const closeApprovalModal = () => (isApprovalModalOpen.value = false);

const openShareModal = () => (isShareModalOpen.value = true);
const closeShareModal = () => (isShareModalOpen.value = false);

// 설정 저장
const saveApprovalSettings = () => {
  approvalData.value = [...approvalList.value];
  console.log("결재선 설정 저장: approvalData: ", approvalData.value);
  closeApprovalModal();
};

const saveShareSettings = () => {
  shareData.value = [...shareList.value]; // 선택된 공유 데이터
  console.log("공유 설정 저장 - shareData: ", shareData.value);
  closeShareModal();
}

// 조직도에서 선택된 사원 업데이트
const updateApprovalSelectedEmployees = (employees) => {
  console.log("updateApprovalSelectedEmployees 호출");
  console.log("조직도에서 선택된 결재선 사원 목록: ", employees);
  selectedApprovalEmployees.value = employees;
  console.log("업데이트 된 selectedApprovalEmployees: ", selectedApprovalEmployees.value);
};

const updateShareSelectedEmployees = (employees) => {
  console.log("updateShareSelectedEmployees 호출");
  console.log("선택된 공유 사원 목록: ", employees);
  selectedShareEmployees.value = employees;
  // shareData.value = employees;  // 공유 리스트 업데이트
  console.log("업데이트 된 shareData: ", shareData.value);
}

const selectedApproveRows = ref(new Set());
const selectedShareRows = ref(new Set());

// 체크박스 선택/해제 핸들러
const toggleApproveRowSelection = (index) => {
  if (selectedApproveRows.value.has(index)) {
    selectedApproveRows.value.delete(index); // 이미 선택된 경우 해제
  } else {
    selectedApproveRows.value.add(index); // 선택 안 된 경우 추가
  }
};

const toggleShareRowSelection = (index) => {
  if (selectedShareRows.value.has(index)) {
    selectedShareRows.value.delete(index); // 이미 선택된 경우 해제
  } else {
    selectedShareRows.value.add(index); // 선택 안 된 경우 추가
  }
};


// 선택된 행 삭제
const deleteApproveSelectedRows = () => {
  approvalList.value = approvalList.value.filter(
      (_, index) => !selectedApproveRows.value.has(index)
  );
  selectedApproveRows.value.clear(); // 선택 목록 초기화
};

const deleteShareSelectedRows = () => {
  shareList.value = shareList.value.filter(
      (_, index) => !selectedShareRows.value.has(index)
  );
  selectedShareRows.value.clear(); // 선택 목록 초기화
};

// 버튼 클릭 시 결재 순서에 추가
const addToApprovalList = (type) => {
  console.log("addToApprovalList 메소드 호출");
  const newApprovals = selectedApprovalEmployees.value.map((emp) => ({
    type, // 결재 방식
    name: emp.name, // 사원 이름
    position: emp.position, // 직위
  }));
  approvalList.value.push(...newApprovals);
  console.log("결재선 추가 - 업데이트 된 approvalList: ", approvalList.value);
  selectedApprovalEmployees.value = []; // 선택 목록 초기화
};

const addToShareList = () => {
  // 추가 한 사람 다시 추가 못하도록
  const newShares = selectedShareEmployees.value.filter(
      (emp) => !shareList.value.some((share) => share.empId === emp.empId)
  ).map((emp) => ({
    empId: emp.empId,
    name: emp.name,
    position: emp.position,
  }));
  shareList.value.push(...newShares);
  selectedShareEmployees.value = [];  // 선택 목록 초기화
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
            @click="closeApprovalModal"
        />
        <ButtonBasic
            color="orange"
            size="medium"
            label="상신하기"
            @click="saveApprovalSettings"
        />
      </div>
    </div>

    <!-- 결재선 -->
    <div class="box-container">
      <ApprovalShareBox
          title="결재선"
          :placeholder="approvalData.length ? '' : '결재선이 없습니다.'"
          :data="approvalData"
          @onSettingsClick="openApprovalModal"
      />

      <!-- 모달 창 -->
      <ModalBasic
          :isOpen="isApprovalModalOpen"
          title="결재선 설정"
          width="1000px"
          :button1="{ label: '닫기', color: 'gray', onClick: closeApprovalModal }"
          :button2="{ label: '저장하기', color: 'orange', onClick: saveApprovalSettings }"
          @close="closeApprovalModal"
      >
        <template #default>
          <div class="modal-layout">
            <!-- 조직도 트리 -->
            <div class="modal-box left">
              <OrganizationTree
                  context="approval"
                  @update:selectedApprovalEmployees="updateApprovalSelectedEmployees"
              />
            </div>

            <!-- 결재 버튼 그룹 -->
            <div class="modal-box center">
              <div class="button-group">
                <ButtonBasic
                    label="동의"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('동의')"
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
                    label="병렬합의"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('병렬합의')"
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
                        @click="toggleApproveRowSelection(index)"
                        :class="{ 'selected-row': selectedApproveRows.has(index) }"
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
                  @click="deleteApproveSelectedRows"
              />
            </div>
          </div>
        </template>
      </ModalBasic>

      <!-- 공유 -->
      <ApprovalShareBox
          title="공유"
          :placeholder="shareData.length ? '' : '공유처가 없습니다.'"
          :data="shareData"
          @onSettingsClick="openShareModal"
      />

      <ModalBasic
          :isOpen="isShareModalOpen"
          title="공유 설정"
          width="800px"
          :button1="{ label: '닫기', color: 'gray', onClick: closeShareModal }"
          :button2="{ label: '저장하기', color: 'orange', onClick: saveShareSettings }"
          @close="closeShareModal"
      >
        <template #default>
          <div class="modal-layout">
            <!-- 조직도 트리 -->
            <div class="modal-box left">
              <OrganizationTree
                  context="share"
                  @update:selectedShareEmployees="updateShareSelectedEmployees"
              />
              <ButtonBasic
                  label="추가"
                  color="white"
                  size="medium"
                  @click="addToShareList"
              />
            </div>

            <!-- 공유 목록 -->
            <div class="modal-box right">
              <h3>공유 리스트</h3>
              <table class="share-table">
                <thead>
                <tr>
                  <th>이름</th>
                  <th>직위</th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="(emp, index) in shareList"
                    :key="emp.empId"
                    :class="{ 'selected-row': selectedShareRows.has(index) }"
                    @click="toggleShareRowSelection(index)"
                >
                  <td>{{ emp.name }}</td>
                  <td>{{ emp.position }}</td>
                </tr>
                </tbody>
              </table>
              <ButtonBasic
                label="삭제"
                color="white"
                size="small"
                @click="deleteShareSelectedRows"
              />
            </div>
          </div>
        </template>
      </ModalBasic>
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
  gap: 10px; /* 버튼 간 간격 */
  align-items: center; /* 중앙 정렬 */
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
  border-collapse: collapse; /* 테두리 겹치기 */
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
.share-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.share-table th,
.share-table td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 8px;
}

.share-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

</style>