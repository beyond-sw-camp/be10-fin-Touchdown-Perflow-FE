<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import {ref} from "vue";
import OrganizationTree from "@/components/common/OrganizationTree.vue";
import draggable from "vuedraggable";
import {createBasicDoc} from "@/config/approval.js";

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

  const typeMapping = {
    동의: "SEQ",
    참조: "CC",
    합의: "AGR",
    병렬: "PLL",
    병렬합의: "PLLAGR"
  };

  const newApprovals = selectedApprovalEmployees.value.map((emp) => ({
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
const content = ref('');  // 문서 내용

// 결재 문서 데이터
const docData = () => {
  return {
    templateId: 4, // 기본 서식 id
    title: title.value, // 문서 제목
    fields: {
      CONTENT: content.value, // 기본 서식의 필드 데이터
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

  if(!title.value || !content.value) {
    alert('빈 칸을 모두 채워주세요.');
    return;
  }

  try {
    const data = docData();
    const response = await createBasicDoc(data);
    alert('결재 문서 생성 완료');
  } catch (error) {
    alert(`결재 문서 생성에 실패했습니다. 오류: ${error.message}`);
    console.error(error);
  }
};

</script>

<template>

  <!-- 헤더 -->
  <div id="header-div">
    <div id="header-top" class="flex-between">
      <p id="title">문서 작성하기</p>
    </div>
    <div id="header-bottom" class="flex-between">
      <div class="tabs">
        <h1>header bottom 영역 - 검색 바 여기에 추가 </h1>
      </div>
    </div>
  </div>

  <div class="main-container">
    <!-- 빈 컨테이너 -->
    <div class="empty-container"></div>

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
              <div class="button-group">
                <button class="custom-button">
                  <span>동의</span>
                  <img src="@/assets/icons/arrow_forward_slim.png" alt="arrow" class="arrow-icon" />
                </button>
                <button class="custom-button">
                  <span>합의</span>
                  <img src="@/assets/icons/arrow_forward_slim.png" alt="arrow" class="arrow-icon" />
                </button>
                <button class="custom-button">
                  <span>참조</span>
                  <img src="@/assets/icons/arrow_forward_slim.png" alt="arrow" class="arrow-icon" />
                </button>
                <button class="custom-button">
                  <span>병렬</span>
                  <img src="@/assets/icons/arrow_forward_slim.png" alt="arrow" class="arrow-icon" />
                </button>
                <button class="custom-button">
                  <span>병렬합의</span>
                  <img src="@/assets/icons/arrow_forward_slim.png" alt="arrow" class="arrow-icon" />
                </button>


<!--                <ButtonBasic-->
<!--                    label="동의"-->
<!--                    color="white"-->
<!--                    size="medium"-->
<!--                    @click="addToApprovalList('동의')"-->
<!--                />-->

<!--                <ButtonBasic-->
<!--                    label="참조"-->
<!--                    color="white"-->
<!--                    size="medium"-->
<!--                    @click="addToApprovalList('참조')"-->
<!--                />-->
<!--                <ButtonBasic-->
<!--                    label="합의"-->
<!--                    color="white"-->
<!--                    size="medium"-->
<!--                    @click="addToApprovalList('합의')"-->
<!--                />-->
<!--                <ButtonBasic-->
<!--                    label="병렬"-->
<!--                    color="white"-->
<!--                    size="medium"-->
<!--                    @click="addToApprovalList('병렬')"-->
<!--                />-->
<!--                <ButtonBasic-->
<!--                    label="병렬합의"-->
<!--                    color="white"-->
<!--                    size="medium"-->
<!--                    @click="addToApprovalList('병렬합의')"-->
<!--                />-->
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
  gap: 20px;  /* form-container, box-container 사이 간격*/
  /* height: 100vh; */
}

.empty-container {
  flex: 0.3;
  max-width: 300px;
}

.form-container {
  flex: 1;
  max-width: 600px;
}

.box-container {
  flex: 0.3;
  max-width: 300px;
}

.modal-layout {
  display: flex;
  gap: 10px;
  height: 100%;
}
.modal-box.center {
  flex: 0.3;
  height: 100%; /* 자식 요소도 부모 높이에 맞춤 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
}

.modal-box.left,
.modal-box.right {
  flex: 1;
}

.button-group {
  display: flex;
  flex-direction: column; /* 버튼 세로 정렬 */
  gap: 10px; /* 버튼 간 간격 */
  justify-content: center;  /* 버튼 중앙 정렬 */
  align-items: center; /* 중앙 정렬 */
}

/* 모달 내부 레이아웃 */
.modal-layout {
  display: flex;
  flex-direction: row;
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
  border-top: 1px solid #ddd; /* 가로선만 */
  text-align: center;
  padding: 8px;
}

.share-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

#title {
  font-size: 40px;
  font-weight: bold;
  color: #3C4651;
}
#header-div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center; /* 가로 중앙 정렬 */
  margin-top: 120px;
}
#header-top, #header-bottom {
  margin-bottom: 10px;
  width: 900px;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 결재선 모달 창 버튼 */

.custom-button {
  display: flex;
  justify-content: space-between; /* 버튼 내부 요소 간격 분리 */
  align-items: center; /* 버튼 높이 정렬 */
  padding: 5px 13px; /* 버튼 내부 여백 */
  width: 100px; /* 버튼의 고정 너비 */
  height: 40px; /* 버튼 높이 */
  background-color: white; /* 버튼 배경색 */
  color: #3C4651; /* 버튼 텍스트 색상 */
  border: 1px solid #ddd; /* 버튼 테두리 */
  border-radius: 8px; /* 버튼 모서리 둥글기 */
  font-size: 14px; /* 텍스트 크기 */
  font-weight: 500; /* 텍스트 두께 */
  cursor: pointer; /* 커서 포인터 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 버튼 그림자 */
}

.custom-button:hover {
  background-color: #f9f9f9; /* 호버 시 배경색 */
}

.custom-button:active {
  background-color: #eee; /* 클릭 시 배경색 */
}

.arrow-icon {
  width: 12px; /* 아이콘 너비 */
  height: auto; /* 아이콘 비율 유지 */
  margin-left: 5px; /* 텍스트와 아이콘 사이 간격 */
}

</style>