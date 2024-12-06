<script setup>
import {ref} from "vue";
import api from "@/config/axios.js";
import { useAuthStore } from '@/store/authStore';

const empId = ref("");
const password = ref("")

const login = async () => {

  const authStore = useAuthStore();

  const response = await api.post(
      `/hr/employees/login`,
      {
        empId : empId.value,
        password : password.value
      }
  );

  const accessToken = response.headers.get(`Authorization`);
  const refreshToken = response.headers.get(`refreshToken`);

  authStore.setTokens(accessToken, refreshToken);
}
const logout = async () => {

  await api.post(`/hr/employees/logout`);

  const authStore = useAuthStore();

  authStore.logout();
}
</script>

<template>
  <input type="text" id="id-input" v-model="empId">
  <input type="password" id="password-input" v-model="password">
  <button @click="login">로그인</button>
  <button @click="logout">로그아웃</button>
</template>

<style scoped>

</style>