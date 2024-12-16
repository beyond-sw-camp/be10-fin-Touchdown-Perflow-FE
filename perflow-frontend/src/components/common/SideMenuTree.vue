<script setup>

import {onMounted} from "vue";
import {useStore} from "@/store/store.js";
import SideMenuNode from "@/components/common/SideMenuNode.vue";

const store = useStore();

onMounted(async () => {
  await store.fetchMenu(); // Pinia를 통해 데이터를 가져옵니다.
});

</script>

<template>
  <div id="side-menu">
    <ul class="side-menu-tree">
      <!--    자식 컴포넌트 (재귀로 계속해서 호출) -->
      <SideMenuNode
          v-for="menu in store.$state.allMenu.filter(menu => !menu.parentId)"
          :key=menu.menuId
          :parent = menu
      />
    </ul>
  </div>
</template>

<style scoped>
.side-menu-tree {
  list-style: none;
}
#side-menu {
  width: 300px;
  font-size: 20px;
}
</style>