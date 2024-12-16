<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import {onMounted} from "vue";

defineProps({
  title: { type: String, required: true }, // 결재선, 공유
  placeholder: { type: String, required: true }, // 비어있을 때 표시할 메시지
});

const emit = defineEmits(["onSettingsClick"]);

// 툴팁 활성화
onMounted(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new globalThis.bootstrap.Tooltip(tooltipTriggerEl); // globalThis를 사용해 bootstrap 접근
  });
});
</script>

<template>
  <div class="box-wrapper">
    <!-- 제목 -->
    <div class="box-title">
      <span>{{ title }}</span>
      <i
          class="bi bi-question-circle"
          data-bs-toggle="tooltip"
          title="설정 방법 안내"
      ></i>
    </div>

    <!-- 박스 컨테이너 -->
    <div class="box-container">
      <!-- 설정 버튼 -->
      <div class="box-header">
        <ButtonBasic
            color="white"
            size="small"
            label="설정"
            @click="emit('onSettingsClick')"
        />
      </div>

      <!-- 비어있을 때 표시 -->
      <div class="box-empty">
        {{ placeholder }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.box-wrapper {
  position: relative;
  margin-bottom: 20px;
}

/* 제목 스타일 */
.box-title {
  position: relative;
  top: -10px; /* 박스 바로 위로 이동 */
  left: 0;
  margin-left: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #3C4651;
  display: flex;
  align-items: center;
}

.box-title .bi-question-circle {
  margin-left: 5px;
  cursor: pointer;
  color: #6c757d;
}

/* 박스 컨테이너 */
.box-container {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 15px;
  width: 300px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: center; /* 수직 중앙 정렬 */
  position: relative; /* 상대 위치 설정 */
  min-height: 150px; /* 최소 높이 설정 */
}

/* 설정 버튼 */
.box-header {
  position: absolute;
  top: 10px;
  right: 10px; /* 설정 버튼을 상단 우측에 배치 */
}

/* 비어있을 때 메시지 */
.box-empty {
  color: #a0a0a0;
  font-size: 14px;
  text-align: center;
}
</style>