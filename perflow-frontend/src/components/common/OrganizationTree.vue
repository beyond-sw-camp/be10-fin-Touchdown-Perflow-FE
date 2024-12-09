<script setup>
import {onMounted, provide, ref} from 'vue';
import { useStore } from '@/store/store.js';
import OrganizationNode from "@/components/common/OrganizationNode.vue";

const store = useStore();

onMounted(async () => {
  await store.fetchOrg(); // Pinia를 통해 데이터를 가져옵니다.
});
</script>

<template>
  <ul>
    <!-- 최상위 항목만 전달 -->
    <OrganizationNode
        v-for="dept in store.$state.allDepartment.filter(dept => !dept.managedDeptId)"
        :key=dept.deptId
        :parent = dept
    />
  </ul>
</template>

<style scoped>
/* 스타일 작성 가능 */
</style>
