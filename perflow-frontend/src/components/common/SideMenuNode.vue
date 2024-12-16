<script setup>

import {useStore} from "@/store/store.js";
import {ref} from "vue";

const store = useStore();

// 하위 메뉴 표시 상태 관리
const isExpanded = ref(false);

// 토글 함수
const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

// Props로 메뉴 데이터 전달
const props = defineProps({
  parent : Object
});

const parentId = props.parent.parentId;

</script>

<template>
  <li @click="toggle">
    <!-- 현재 메뉴 이름 출력 -->
    {{ props.parent.name }}
    <!-- 하위 부서 렌더링 -->
    <ul v-if="isExpanded" class="menu-child">
      <SideMenuNode
          v-for="child in store.$state.allMenu.filter(menu => menu.parentId === props.parent.id)"
          :key="child.menuId"
          :parent="child"
      />
    </ul>
  </li>
</template>

<style scoped>
.menu-child {
  list-style: none;
}
</style>