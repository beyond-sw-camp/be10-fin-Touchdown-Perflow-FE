<script setup>
import { ref } from "vue";
import ButtonBasic from "@/components/common/ButtonBasic.vue";
import ModalBasic from "@/components/common/ModalBasic.vue";
import SearchGroupBar from "@/components/common/SearchGroupBar.vue";

// 상태 관리
const isOpen = ref(false); // 모달 열림 여부
const annualType = ref(""); // 연차 구분
const applyDate = ref(""); // 연차 신청일
const approver = ref(""); // 결재자
const startDate = ref(""); // 기간 시작일
const endDate = ref(""); // 기간 종료일

// 연차 구분 옵션
const annualTypeOptions = [
  { label: "연차", value: "FULLDAY" },
  { label: "오전 반차", value: "MORNINGHALF" },
  { label: "오후 반차", value: "AFTERNOONHALF" },
];

// 모달 열기/닫기
const openModal = () => (isOpen.value = true);
const closeModal = () => (isOpen.value = false);

// 신청 버튼 클릭 핸들러
const handleApply = () => {
  console.log("연차 신청 정보:");
  console.log({
    annualType: annualType.value,
    applyDate: applyDate.value,
    approver: approver.value,
    startDate: startDate.value,
    endDate: endDate.value,
  });

  // 여기서 API 호출 또는 처리 로직 추가
  alert("연차 신청이 완료되었습니다!");

  // 모달 닫기
  closeModal();
};
</script>

<template>
  <div>
    <!-- 연차 신청 버튼 -->
    <ButtonBasic label="연차 신청하기" color="orange" @click="openModal" />

    <!-- 연차 신청 모달 -->
    <ModalBasic
        :isOpen="isOpen"
        title="연차 신청하기"
        :button1="{ label: '취소', color: 'gray', onClick: closeModal }"
        :button2="{ label: '신청', color: 'orange', onClick: handleApply }"
        width="800px"
        height="auto"
        @close="closeModal"
    >
      <!-- 연차 신청 폼 -->
      <div class="form-container">
        <!-- 연차 신청일 -->
        <div class="form-group">
          <SearchGroupBar
              v-model="applyDate"
              placeholder="연차 신청일"
              type="date"
          />
        </div>

        <!-- 연차 구분 -->
        <div class="form-group">
          <select v-model="annualType" class="dropdown">
            <option value="" disabled>연차 구분</option>
            <option
                v-for="option in annualTypeOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 결재자 검색 -->
        <div class="form-group search-box">
          <input v-model="approver" placeholder="결재자 검색" />
          <button class="search-btn">🔍</button>
        </div>

        <!-- 기간 선택 -->
        <div class="form-group date-range">
          <SearchGroupBar
              v-model="startDate"
              placeholder="기간"
              type="date"
          />
          ~
          <SearchGroupBar v-model="endDate" placeholder="" type="date" />
        </div>
      </div>
    </ModalBasic>
  </div>
</template>

<style scoped>
/* 폼 컨테이너 */
.form-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 20px;
}

/* 폼 그룹 */
.form-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 드롭다운 */
.dropdown {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

/* 검색 박스 */
.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
}

.search-btn {
  border: none;
  background: none;
  cursor: pointer;
}

/* 날짜 범위 선택 */
.date-range {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 버튼 스타일 */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>
