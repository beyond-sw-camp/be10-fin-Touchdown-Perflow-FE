<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import InputField from "@/components/common/InputField.vue";
import ApprovalShareBox from "@/components/common/ApprovalShareBox.vue";

</script>

<template>
<div class="form-container">

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
        @click="handleClick"
    />

    <ButtonBasic
        color="orange"
        size="medium"
        label="상신하기"
        @click="handleClick"
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

    <!-- 공유 -->
    <ApprovalShareBox
        title="공유"
        placeholder="공유처가 없습니다."
        @onSettingsClick="() => handleSettingsClick('공유')"
    />

  </div>
</template>

<style scoped>
/* 부모 컨테이너 중앙 배치 */
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 가로 가운데 정렬 */
  justify-content: center; /* 세로 가운데 정렬 */
  height: 100vh; /* 화면 전체 높이 */
  gap: 20px; /* 필드 간 간격 */
  padding: 20px;
  box-sizing: border-box;
}

/* 버튼 그룹 간격 추가 */
.button-group {
  display: flex;
  gap: 50px; /* 버튼 사이 간격 */
}
</style>