<script setup>

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

    </div>
    <div class="item-title">
      <p class="number">02</p><p class="title">CSV 템플릿 업로드</p>
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

</style>