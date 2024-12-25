<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import api from "@/config/axios.js";

let timerInterval = null;
let isTimerActive = false;

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: "제목" },
  type: { type: String, default: 'on' },
  width: { type: String, default: "400px" },
  height: { type: String, default: "auto" },
});

const emit = defineEmits(["close"]);

// 모달이 열릴 때 QR 코드 생성
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {

    await generateQRCode(); // 모달 열릴 때 QR 코드 생성
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    isTimerActive = true;

  }else{
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerActive = false;
  }
});

onUnmounted(()=>{
  clearInterval(timerInterval);
  timerInterval = null;
  isTimerActive = false;
})

const qrCodeImage = ref('');
const inputCode = ref('');
const generatedCode = ref('');
const timer = ref(30);
const timerDisplay = ref('0:30');

const closeModal = () => {
  emit("close");
};

const generateQRCode = async () => {
  try {
    if(!isTimerActive) return;
    const endpoint = props.type === 'on'
        ? 'emp/attendances/check-in/qr/generate'
        : 'emp/attendances/check-out/qr/generate';

    const response = await api.post(endpoint);

    console.log('API 응답 데이터:', response.data);

    const base64String = response.data;

    if (!base64String) {
      throw new Error('QR 코드 데이터가 비어 있습니다.');
    }
    qrCodeImage.value = `data:image/png;base64,${base64String}`;
    generatedCode.value = response.data.code;
    timer.value = 30;
    updateTimerDisplay();
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    alert('QR 코드 생성 실패: ' + error.message);
  }
};



const updateTimer = () => {
  if (timer.value > 0) {
    timer.value -= 1;
    updateTimerDisplay();
  } else {
    generateQRCode();
    isTimerActive = false;
  }
};

const updateTimerDisplay = () => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  timerDisplay.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const handleSubmit = async () => {
  try {
    const endpoint = props.type === 'on'
        ? 'emp/attendances/check-in'
        : 'emp/attendances/check-out';

    const response = await api.post(endpoint, null, {
      params: { qrCode: inputCode.value },
    });

    console.log('서버 응답:', response.data); // 응답 데이터 로깅

    // 상태 코드가 200번대일 때만 성공 처리
    if (response.status >= 200 && response.status < 300) {
      alert(`${props.type === 'on' ? '출근' : '퇴근'} 처리 완료`);
      clearInterval(timerInterval);
      closeModal();
    } else {
      throw new Error('서버 응답 오류'); // 실패 처리 강제 실행
    }
  } catch (error) {
    console.error('처리 실패:', error);
    alert('처리 실패. 다시 시도하세요.');
  }
};


const refreshCode = async () => {
  await generateQRCode();
  timer.value = 30;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer,1000);
};

onMounted(() => {

  setInterval(updateTimer, 1000);
});
</script>

<template>
  <!-- 모달 배경 -->
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <!-- 모달 컨테이너 -->
    <div class="modal-container" :style="{ width: width, height: height }">
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="modal-close" @click="closeModal">&#10006;</button>
      </div>

      <!-- 모달 내용 -->
      <div class="modal-content">
        <!-- QR 코드 표시 -->
        <div v-if="qrCodeImage" class="qr-code">
          <img :src="qrCodeImage" alt="QR Code" />
        </div>

        <!-- 새로고침 버튼 -->
        <div class="refresh-btn" @click="refreshCode">&#x21bb;</div>

        <!-- 숫자 입력 필드 및 타이머 -->
        <div class="code-input">
          <input
              type="text"
              v-model="inputCode"
              maxlength="6"
              placeholder="숫자 6자리 입력"
          />
          <span class="timer">{{ timerDisplay }}</span>
        </div>
      </div>

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button @click="closeModal" class="btn-gray">취소</button>

        <button @click="handleSubmit" class="btn-orange">확인</button>
      </div>
    </div>
  </div>
</template>




<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.qr-code img {
  width: 200px;
  height: 200px;
  margin: 10px auto;
  display: block;
}

.refresh-btn {
  margin: 10px auto;
  cursor: pointer;
  font-size: 20px;
}

.code-input {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.timer {
  font-size: 16px;
  font-weight: bold;
  color: #f37321;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-orange {
  padding: 10px 20px;
  background: linear-gradient(to right, #f37321, #fb0);
  color: white;
  border-radius: 5px;
  border: white;
}

.btn-gray {
  padding: 10px 20px;
  background: #d9d9d9;
  color: #3c4651;
  border-radius: 5px;
  border: white;
}

.modal-close {
  background: white;               /* 배경색 하얀색 */
  border: 2px solid white;         /* 테두리 하얀색 */
  border-radius: 50%;              /* 동그란 모양 */
  color: black;                    /* 글자색 검정 */
  font-size: 16px;                 /* 글자 크기 */
  width: 30px;                     /* 버튼 너비 */
  height: 30px;                    /* 버튼 높이 */
  display: flex;                   /* 중앙 정렬 */
  align-items: center;
  justify-content: center;
  cursor: pointer;                 /* 마우스 커서 포인터 */
}

</style>