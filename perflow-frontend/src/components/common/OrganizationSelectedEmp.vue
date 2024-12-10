<script setup>

import {useStore} from "@/store/store.js";

const store = useStore()

</script>

<template>

  <div v-for="empList in store.$state.allEmployee">
    <p v-for="emp in empList">
      <a v-for="detail in emp">
        {{detail.empId}}
        {{detail.position}}
        {{ detail.name }}
      </a>
    </p>
  </div>
</template>

<style scoped>

</style>