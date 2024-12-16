<script setup>
import ButtonBasic from "@/components/common/ButtonBasic.vue";

defineProps({
  title: { type: String, required: true }, // 결재선, 공유
  placeholder: { type: String, required: true }, // 비어있을 때 표시할 메시지
});

const emit = defineEmits(["onSettingsClick"]);
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
}

.box-header {
  display: flex;
  justify-content: flex-end; /* 설정 버튼 우측에 정렬 */
  margin-bottom: 10px;
}

.box-empty {
  color: #a0a0a0;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
}
</style>