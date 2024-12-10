<script setup>
import {useStore} from "@/store/store.js";
import {computed, ref} from "vue";

// Props로 부서 데이터 전달
const props = defineProps({
  parent : Object
});

const store = useStore();
const parentId = props.parent.deptId;
// 하위 부서 표시 상태 관리
const isExpanded = ref(false);

// 토글 함수
const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

const checkDept = (event, deptId) => {

  if(event.target.checked){
    store.addEmp(Number(deptId));
  } else {
    store.removeEmp(Number(deptId));
  }
}

</script>

<template>
  <li class="menu">
    <!-- 현재 부서 이름 출력 -->
    <input type="checkbox" @click="checkDept($event,props.parent.deptId)">
    {{ props.parent.name }}
    <span @click="toggle">{{ isExpanded ? '[-]' : '[+]' }}</span>
    <!-- 하위 부서 렌더링 -->
    <ul v-if="isExpanded" class="menu">
      <OrganizationNode
          v-for="child in store.$state.allDepartment.filter(dept => dept.managedDeptId === parentId)"
          :key="child.deptId"
          :parent="child"
      />
    </ul>
  </li>
</template>
<style>
.menu {
  list-style: none;
}
</style>