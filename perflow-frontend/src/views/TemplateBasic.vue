<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import {ref} from "vue";
import OrganizationTree from "@/components/common/OrganizationTree.vue";

const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true; // 모달 열기
};

const closeModal = () => {
  isModalOpen.value = false; // 모달 닫기
};

const saveSettings = () => {
  alert("설정이 저장되었습니다!");
  closeModal(); // 저장 후 모달 닫기
};

const handleSettingsClick = (type) => {
  console.log(`${type} 설정 버튼이 클릭되었습니다.`);
  openModal(); // 모달 열기 함수 호출
};
</script>

<template>
  <div class="main-container">
    <div class="form-container">
      <OrganizationTree />
      <!--제목-->
      <InputField
          v-model="title"
          label="제목"
          placeholder="제목을 입력해 주세요."
          :isRequired="true"
      />

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
    <div class="box-container">
      <!-- 결재선 -->
      <ApprovalShareBox
          title="결재선"
          placeholder="결재선이 없습니다."
          @onSettingsClick="() => handleSettingsClick('결재선')"
      />

      <!-- 공용 모달 -->
      <ModalBasic
          :isOpen="isModalOpen"
          title="결재선 설정"
          :button1="{ label: '닫기', color: 'gray', onClick: closeModal }"
          :button2="{ label: '저장하기', color: 'orange', onClick: saveSettings }"
          @close="closeModal"
      >
        <!-- Custom Content -->
        <template #default>
            <!-- 조직도 트리 -->
          <OrganizationTree />
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
  display: flex; /* flex를 사용해서 가로 배치 */
  justify-content: center; /* form-container를 기준으로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 100px; /* form-container와 box-container 사이 간격 */
  height: 100vh; /* 전체 화면 높이 */
}

/* 부모 컨테이너 중앙 배치 */
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 컨텐츠 중앙 정렬 */
  justify-content: center; /* 세로 중앙 */
  gap: 20px;
  width: 400px; /* 폼의 너비 고정 */
}

.box-container {
  display: flex;
  flex-direction: column; /* 위아래 정렬 */
  gap: 20px; /* 결재선과 공유 사이 간격 */
}

/* 버튼 그룹 간격 추가 */
.button-group {
  display: flex;
  gap: 50px; /* 버튼 사이 간격 */
}
</style>