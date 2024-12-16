<script setup>
// 상태 관리
import { ref } from 'vue';

// 드롭다운 상태
const isOpen = ref(false);

// 메뉴 열기/닫기 토글
const toggleDropdown = () => {
  console.log('드롭다운 토글됨: ', isOpen.value); // 상태 변경 확인
  isOpen.value = !isOpen.value;
};

// 각 메뉴 항목에 대한 동작 처리 함수
const onDownload = () => {
  console.log('다운로드 실행됨');
  isOpen.value = false; // 메뉴 닫기
};

const onUpload = () => {
  console.log('업로드 실행됨');
  isOpen.value = false; // 메뉴 닫기
};
</script>

<template>
  <div class="dropdown">
    <!-- 엑셀 버튼 -->
    <div class="dropdown-button" @click="toggleDropdown">
      엑셀
      <img
          v-if="isOpen"
          src="../../assets/image/arrow_up_1.png"
          alt="arrow up"
          class="arrow-icon"
      />
      <img
          v-else
          src="../../assets/image/arrow_down_1.png"
          alt="arrow down"
          class="arrow-icon"
      />
    </div>

    <!-- 드롭다운 메뉴 -->
    <div v-if="isOpen" class="dropdown-menu">
      <div class="dropdown-item" @click="onDownload">다운로드</div>
      <div class="dropdown-item" @click="onUpload">업로드</div>
    </div>
  </div>
</template>

<style scoped>
/* 드롭다운 스타일 */
.dropdown {
  position: relative;
  display: inline-block;
}

/* 버튼 스타일 */
.dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #ff9900, #ffcc33);
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  width: 120px;
}

.arrow-icon {
  width: 25px;
  margin-left: 8px;
}

/* 드롭다운 메뉴 스타일 */
.dropdown-menu {
  position: absolute;
  top: 100%; /* 버튼 아래에 나타나게 설정 */
  left: 0;
  background: white;
  border: 1px solid #ff9900;
  border-radius: 5px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 120px;
  margin-top: 4px; /* 버튼과 메뉴 간의 간격을 설정 */
}

/* 드롭다운 아이템 스타일 */
.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  color: #3c4651;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f4f4f4;
}
</style>
