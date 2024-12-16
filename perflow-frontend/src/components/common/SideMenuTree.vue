<script setup>

import {onMounted} from "vue";
import {useStore} from "@/store/store.js";
import OrganizationSelectedEmp from "@/components/common/OrganizationSelectedEmp.vue";
import SideMenuNode from "@/components/common/SideMenuNode.vue";

const store = useStore();

onMounted(async () => {
  await store.fetchMenu(); // Pinia를 통해 데이터를 가져옵니다.
});

</script>

<template>
  <ul class="side_menu">
    <!--    자식 컴포넌트 (재귀로 계속해서 호출) -->
    <SideMenuNode
        v-for="menu in store.$state.allMenu.filter(menu => !menu.parentId)"
        :key=menu.menuId
        :parent = menu
    />
  </ul>
</template>

<style scoped>
.side_menu {
  list-style: none;
}
</style>