<script setup>

import ModifyInputFeild from "@/components/modifyer/ModifyInputFeild.vue";
import {ref} from "vue";

const props = defineProps({
      isSidebarOpen: {
        type: Boolean,
        default: false
      },
      title: String
});
const emit = defineEmits(['close-sidebar'])

const email = ref("");
const contact = ref("");
const address = ref("");

const updateEmail = (value) => {
  email.value = value;
}
const updateContact = (value) => {
  contact.value = value;
}
const updateAddress = (value) => {
  address.value = value;
}


function closeSidebar() {
  emit('close-sidebar')
}
</script>

<template>
<div class="modify-sidebar" :class="{ open: props.isSidebarOpen }">
  <div id="side-header">
    <img src="@/assets/image/arrow-right.png" @click="closeSidebar" id="close">
    <p id="title">{{props.title}}</p>
  </div>
  <div id="modify-contents">
    <ModifyInputFeild title="연락처" @update-value="updateContact"/>
    <ModifyInputFeild title="이메일" @update-value="updateEmail"/>
  </div>
</div>
</template>

<style scoped>
p{
  margin: 0;
  padding: 0;
}
/* 사이드바 기본 스타일 */
.modify-sidebar {
  position: fixed;
  right: -400px;
  top: 0;
  bottom: 0;
  width: 400px;
  height: 1000px;
  transition: right 0.3s ease;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
  z-index: 10000; /* 모든 콘텐츠 위에 표시 */
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}
/* 사이드바가 열릴 때 클래스 */
.modify-sidebar.open {
  right: 0;
}
#side-header {
  padding: 20px 10px 20px 10px;
  height: 81px;
  border-bottom: 1px solid #817F7F;
  display: flex;
  align-items: center;
}
#modify-contents {
  padding: 50px 20px 20px 20px;
}
#close {
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 120px;
}
#title {
  font-weight: bold;
  font-size: 20px;
}
</style>