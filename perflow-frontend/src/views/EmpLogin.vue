<script setup>
import {ref} from "vue";
import api from "@/config/axios.js";
import { useAuthStore } from '@/store/authStore';

const empId = ref("");
const password = ref("")

const login = async () => {

  const authStore = useAuthStore();

  const response = await api.post(
      `http://localhost:8080/api/v1/hr/employees/login`,
      {
        empId : empId.value,
        password : password.value
      }
  );

  const accessToken = response.headers.get(`Authorization`);
  const refreshToken = response.headers.get(`refreshToken`);
  console.log(accessToken);
  console.log(refreshToken)

  authStore.setTokens(accessToken, refreshToken);
}
</script>

<template>
  <input type="text" id="id-input" v-model="empId">
  <input type="password" id="password-input" v-model="password">
  <button @click="login">로그인</button>
</template>

<style scoped>

</style>