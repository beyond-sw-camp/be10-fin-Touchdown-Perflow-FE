<script setup>
import ButtonLong from "@/components/common/ButtonLong.vue";
import api from "@/config/axios.js";

const downloadCSV = async () => {
  try {
    const response = await api.get('/csv/download', {
      responseType: 'blob', // 바이너리 데이터를 받기 위해 blob으로 설정
    });

    // 응답 헤더에서 파일명 추출
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'employee.csv'; // 기본 파일명
    if (contentDisposition) {
      const match = contentDisposition.match(/filename\*?=['"]?([^;\r\n"]+)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1].replace(/UTF-8''/, ''));
      }
    }

    // Blob 생성
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });

    // 브라우저에서 파일 다운로드 처리
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // 링크 제거

  } catch (error) {
    console.error('CSV 다운로드 실패:', error);
  }
}
</script>

<template>
  <div id="emp-list-register-container">
    <div id="container-header">
      <p id="sub-title">구성원/구성원등록</p>
      <p id="container-title">구성원</p>
    </div>
    <div class="container-item">
      <div id="notice"><img src="@/assets/image/check.png" alt="체크"><p>주의 사항</p></div>
      <div id="notice-item">
        <p>1. perflow 제공 양식이 아닐 경우 업로드에 실패할 수 있습니다.</p>
        <p>2. 양식을 임의로 수정할 경우 업로드에 실패할 수 있습니다.</p>
        <p>3. 필수 입력 사항이 비어있을 경우 업로드에 실패할 수 있습니다.</p>
      </div>
    </div>
    <div class="item-title">
      <p class="number">01</p><p class="title">CSV 템플릿 다운로드</p>
    </div>
    <div class="container-item">
      <div class="item-list">

      </div>
      <div class="item-list">

      </div>
    </div>
    <ButtonLong label="CSV 엑셀파일 템플릿 다운로드" @click="downloadCSV"/>
    <div class="item-title">
      <p class="number">02</p><p class="title">CSV 파일 업로드 및 등록</p>
    </div>
    <div class="container-item">

    </div>
  </div>
</template>

<style scoped>
p {
  padding: 0;
  margin: 0;
}
#emp-list-register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: #3C4651;
}
#container-header, .container-item {
  width: 900px;
  margin-top: 20px;
}
#sub-title {
  font-size: 20px;
  padding: 0;
  margin: 0;
  height: 20px;
}
#container-title {
  font-size: 35px;
  font-weight: bold;
  color: #3C4651;
  margin-top: 10px;
}
.item-title {
  display: flex;
  gap: 20px;
  width: 900px;
  font-size: 25px;
  font-weight: bold;
  margin-top: 40px;
}
.number {
  color: #F37321;
}
#notice {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 300px;
  margin-bottom: 20px;
}
#notice > p {
  font-size: 25px;
  font-weight: bold;
}
#notice-item {
  display: flex;
  flex-direction: column;
  gap: 15px;
  font-size: 20px;
  color: #3C4651;
  font-weight: bold;
}

.container-item {
  border: 1px solid #AFA9A9 ;
  border-radius: 10px;
  height: 250px;
  padding: 20px;
}
.item-list {
  height: 50%;
}
</style>