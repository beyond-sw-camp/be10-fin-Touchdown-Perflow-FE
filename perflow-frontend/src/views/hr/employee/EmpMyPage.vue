<script setup>

import ButtonBack from "@/components/common/ButtonBack.vue";
</script>

<template>
  <div id="my-page-container">
    <div id="title-container">
      <p>마이페이지</p>
      <ButtonBack/>
    </div>
    <div id="info-header-container">
    </div>
    <div id="middle-line">

    </div>
    <div id="info-main-container">

    </div>
  </div>
</template>

<style scoped>
#my-page-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3c4651 ;
}
#title-container, #info-header-container, #info-main-container {
  width: 900px;
}
#title-container {
  height: 150px;
  display: flex;
  justify-content: space-between;
  padding-top: 50px;
}
#title-container > p {
  font-weight: bold;
  font-size: 35px;
}
</style>