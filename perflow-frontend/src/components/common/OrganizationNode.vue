<script setup>
import {useStore} from "@/store/store.js";

// Props로 부서 데이터 전달
const props= defineProps({
  parent : Object
});
const store = useStore();

const parentId = props.parent.deptId;

</script>

<template>
  <li>
    <!-- 현재 부서 이름 출력 -->
    <input type="checkbox">
    {{ props.parent.name }}

    <!-- 하위 부서 렌더링 -->
    <ul v-if="store.$state.allDepartment.some(dept => dept.managedDeptId === parentId)">
      <OrganizationNode
          v-for="child in store.$state.allDepartment.filter(dept => dept.managedDeptId === parentId)"
          :key="child.deptId"
          :parent="child"
      />
    </ul>
  </li>
</template>
