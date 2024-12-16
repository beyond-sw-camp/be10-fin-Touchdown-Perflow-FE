<script setup>

import {onMounted} from "vue";
import {useStore} from "@/store/store.js";

const store = useStore();

onMounted(async () => {
  await store.fetchMenu(); // Pinia를 통해 데이터를 가져옵니다.
});

</script>

<template>

</template>

<style scoped>

</style>