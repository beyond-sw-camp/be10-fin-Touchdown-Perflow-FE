<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/approval/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import {computed, ref} from "vue";
import OrganizationTree from "@/components/approval/OrganizationTree.vue";
import draggable from "vuedraggable";
import {createNewDocument} from "@/config/approval.js";
import router from "@/router/router.js";
import ButtonDropDown2 from "@/components/common/ButtonDropDown2.vue";
import SearchGroupBar from "@/components/common/SearchGroupBar.vue";

const selectedApprovalEmployees = ref([]); // 체크된 사원 목록
const selectedShareEmployees = ref([]); // 체크된 사원 목록

const approvalList = ref([]); // 결재 목록
const approvalData = ref([]);  // approvalShareBox 에 전달할 데이터

const shareList = ref([]);  // 공유 목록
const shareData = ref([]);  // 모달에서 선택한, approvalShareBox 에 전달할 데이터

// 서식 드롭다운
const dropdownOptions = [
  { label: "기본 서식", id: "newDoc" },
  { label: "지출결의서", id: "cashDisbursement" },
  { label: "업무보고서", id: "workReport" },
];

// 드롭다운 선택 시 호출
const handleDropdownSelect = (id) => {
  router.push({ name: id });
}

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

  const typeMapping = {
    동의: "SEQ",
    참조: "CC",
    합의: "AGR",
    병렬: "PLL",
    병렬합의: "PLLAGR"
  };

  const newApprovals = selectedApprovalEmployees.value.map((emp) => ({
    type,
    displayType: type,  // 결재방식 - 한글 값
    approveType: typeMapping[type], // 결재방식 - enum 값
    name: emp.name, // 사원 이름
    position: emp.position, // 직위
    empId: emp.empId,
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

const title = ref('');  // 문서 제목
const fromDate = ref('');
const toDate = ref('');
const PROGRESSING = ref('');
const SPECIAL = ref('');
const PLANNED = ref('');

// 결재 문서 데이터
const docData = () => {

  return {
    templateId: 6, // 업무보고서 서식 ID
    title: title.value, // 문서 제목
    fields: {
      fromDate: fromDate.value,
      toDate: toDate.value,
      PROGRESS: PROGRESSING.value,
      SPECIAL: SPECIAL.value,
      PLANNED: PLANNED.value,
    },
    approveLines: approvalList.value.map((line, index) => ({
      groupId: null,
      approveType: line.approveType,
      approveLineOrder: index + 1,
      pllGroupId: null,
      approveTemplateTypes: 'MANUAL',
      approveSbjs: [
        {
          empDeptType: 'EMPLOYEE',
          empId: line.empId,
        },
      ],
    })),
    shares: shareList.value.map((share) => ({
      shareEmpDeptType: 'EMPLOYEE',
      employees: [share.empId],
    })),
  };
};

const createNewDoc = async () => {

  if (!title.value || !fromDate.value || !toDate.value) {
    alert('필수 항목을 모두 입력해주세요.');
    return;
  }

  try {
    const data = docData();
    const response = await createNewDocument(data);
    alert('결재 문서 생성 완료');
    goTo("/approval/waiting");
  } catch (error) {
    alert(`결재 문서 생성에 실패했습니다. 오류: ${error.message}`);
    console.error(error);
  }
};

const goTo = (url) => {
  router.push(url);
}

</script>

<template>

  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">결재 문서 생성</p>
    </div>
    <div id="header-bottom" class="flex-between">
      <div class="tabs">
        <span class="tab active">업무 보고서</span>
      </div>
    </div>
  </div>

  <div class="main-container">
    <!-- 빈 컨테이너 -->
    <div class="empty-container"></div>

    <div class="form-container">

      <div class="field-container">

        <div class="date-selection-container">
          <!-- 진행 기간 -->
          <label class="label">
            <span class="label-name">진행일시</span>
            <span class="asterisk">*</span>
          </label>
          <SearchGroupBar
              v-model="fromDate"
              placeholder="시작일"
              type="date"
          />
          <span class="tilde"> ~ </span>
          <SearchGroupBar
              v-model="toDate"
              placeholder="완료일"
              type="date"
          />
        </div>

        <!-- 제목 -->
        <InputField
            v-model="title"
            label="제목"
            placeholder="제목을 입력해 주세요."
            :isRequired="true"
            width="600px"
        />

        <!-- 진행사항 -->
        <InputField
            v-model="PROGRESSING"
            label="진행사항"
            placeholder="내용을 입력해 주세요."
            type="textarea"
            height="180px"
            width="600px"
        />
        <!-- 특이사항 -->
        <InputField
            v-model="SPECIAL"
            label="특이사항"
            placeholder="내용을 입력해 주세요."
            type="textarea"
            height="180px"
            width="600px"
        />
        <!-- 예정사항 -->
        <InputField
            v-model="PLANNED"
            label="예정사항"
            placeholder="내용을 입력해 주세요."
            type="textarea"
            height="180px"
            width="600px"
        />

      </div>

      <div class="button-group">
        <ButtonBasic
            color="gray"
            size="medium"
            label="취소하기"
            @click=""
        />
        <ButtonBasic
            color="orange"
            size="medium"
            label="상신하기"
            @click="createNewDoc"
        />
      </div>
    </div>

    <!-- 결재선 -->
    <div class="box-container">

      <!-- 드롭 다운 -->
      <span class="dropdown-title">서식 선택</span>
      <ButtonDropDown2
          :options="dropdownOptions"
          defaultOption="기본 서식"
          width="155px"
          height="35px"
          fontSize="15px"
          @selectId="handleDropdownSelect"
      />

      <ApprovalShareBox
          title="결재선"
          :placeholder="approvalData.length ? '' : '결재선이 없습니다.'"
          :data="approvalData.map((item) => ({
          ...item,
          type: item.displayType  // 한글 값만 표시
          }))"
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
              <div class="approval-button-group">
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
                    label="병렬"
                    color="white"
                    size="medium"
                    @click="addToApprovalList('병렬')"
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
              <div class="table-container">
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
              </div>

              <div class="button-container">
                <ButtonBasic
                    label="삭제"
                    color="white"
                    size="small"
                    @click="deleteApproveSelectedRows"
                />
              </div>
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
                  size="small"
                  @click="addToShareList"
              />
            </div>

            <!-- 공유 목록 -->
            <div class="modal-box right">
              <h3>공유 리스트</h3>
              <div class="table-container">
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
              </div>
              <div class="button-container">
                <ButtonBasic
                    label="삭제"
                    color="white"
                    size="small"
                    @click="deleteShareSelectedRows"
                />
              </div>
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
  justify-content: center; /* 중앙 정렬 */
  /* align-items: center; /* 세로 정렬 */
  gap: 0px;
  min-width: 1200px;  /* 최소 너비 설정 */
  padding: 0 50px;  /* 좌우 여백 */
}

.empty-container {
  flex: 0.3;
  min-width: 200px;
  max-width: 300px;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 600px;
  margin-top: 50px;
  margin-right: 30px;
}

.field-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 700px;
}

.box-container {
  flex: 0.3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
}

.button-group {
  display: flex;
  flex-direction: row; /* 버튼 가로 정렬 */
  gap: 40px; /* 버튼 간 간격 */
  align-items: center; /* 중앙 정렬 */
  margin-top: auto; /* 버튼을 항상 아래쪽으로 */
  padding-top: 20px;  /* 버튼 위에 여유 공간 */
}

.approval-button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin: 20px;
  width: fit-content; /* 자식인 buttonbasic 의 폭에 맞춤 */
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
  border: none;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
}

.modal-box.center {
  max-width: fit-content;
  padding: 0;
  margin: auto;
}

.modal-box.left {
  height: fit-content; /* 자식 컴포넌트 크기에 맞춤*/
  padding-right: 0;
}

.modal-box.right {
  display: flex;
  flex-direction: column;
  height: 300px; /* 전체 높이를 고정 */
}

.share-table,
.approval-table {
  flex: 1; /* 테이블이 가능한 최대 공간을 차지 */
  overflow-y: auto; /* 내용이 많아지면 스크롤 */
  margin: 0;
  border-spacing: 0; /* 셀 간의 간격 제거 */
  border-collapse: separate; /* 둥근 테두리 유지 */
}

.table-container {
  flex: 1;
  overflow-y: auto; /* 테이블에 스크롤 추가 */
  margin-top: 30px;
  margin-bottom: 20px; /* 버튼과 테이블 간의 간격 */
}

.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽 정렬 */
  margin-top: 10px; /* 테이블과 버튼 사이의 간격 */
}

.date-selection-container {
  display: flex;
  align-items: center;
  height: 40px; /* 고정 높이 설정 */
  margin-bottom: 20px;
}

.label {
  display: inline-flex;
  align-items: center;
  width: 80px;
}

.tilde {
  margin: 0 5px;
  line-height: 40px;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}


.approval-table {
  width: 100%;
  border: 1px solid #D9D9D9; /* 테이블 바깥 테두리 */
  border-radius: 10px; /* 둥근 테두리 */
  border-spacing: 0; /* 셀 간의 간격 제거 */
  border-collapse: separate; /* border-spacing 적용을 위해 separate 설정 */
  overflow: hidden; /* 둥근 테두리를 유지 */
  margin-top: 10px;
}

.approval-table th,
.approval-table td {
  border: none; /* 내부 셀의 모든 테두리 제거 */
  border-bottom: 1px solid #D9D9D9; /* 셀 아래 가로선만 표시 */
  padding: 8px;
  text-align: center;
}

.approval-table tr:last-child td {
  border-bottom: none; /* 마지막 행의 아래쪽 가로선 제거 */
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
  border: 1px solid #D9D9D9; /* 테이블 바깥 테두리 */
  border-radius: 10px; /* 둥근 테두리 */
  border-spacing: 0; /* 셀 간의 간격 제거 */
  border-collapse: separate; /* border-spacing 적용을 위해 separate 설정 */
  overflow: hidden; /* 둥근 테두리를 유지 */
  margin-top: 10px;
}

.share-table th,
.share-table td {
  border: none; /* 내부 셀의 모든 테두리 제거 */
  border-bottom: 1px solid #D9D9D9; /* 셀 아래 가로선만 표시 */
  padding: 8px;
  text-align: center;
}

.share-table tr:last-child td {
  border-bottom: none; /* 마지막 행의 아래쪽 가로선 제거 */
}

.share-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

#title {
  font-size: 35px;
  font-weight: bold;
  color: #3C4651;
}

#header-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-top: 50px;
}

#header-top, #header-bottom {
  margin-bottom: 10px;
  width: 900px;
}

.tabs {
  display: flex;
  gap: 20px;
  font-size: 20px;
}

.tab {
  cursor: pointer;
  padding: 5px 10px;
}

.tab.active {
  font-weight: bold;
  border-bottom: 2px solid #ff6600;
}

.dropdown-title {
  font-size: 14px;
  font-weight: bold;
  color: #3C4651;
}

.label-name {
  font-size: 14px;
  font-weight: bold;
  margin-right: 5px;
}

.asterisk {
  color: red;
  margin-right: 15px;
}

</style>