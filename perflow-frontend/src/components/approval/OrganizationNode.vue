<script setup>
import {useStore} from "@/store/store.js";
import {ref} from "vue";
import leftArrow from '@/assets/icons/left_arrow.png'
import rightArrow from '@/assets/icons/right_arrow.png'

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

// 부서 클릭 시 호출
const selectDepartment = () => {

  // 부서 클릭 시 해당 부서 사원 정보 가져옴
  // store.selectDept(props.parent.deptId);
  store.selectDept(props.parent.deptId);
}

const checkDept = (event, deptId) => {

  if(event.target.checked){
    store.addEmp(Number(deptId));
  } else {
    store.removeEmp(Number(deptId));
  }
}

</script>

<template>
  <li class="dept-item">
    <!-- 부서명 왼쪽에 이미지 삽입-->
    <img
        :src="isExpanded ? rightArrow : leftArrow"
        @click.stop.prevent="toggle"
        class="toggle-icon"
        alt="toggle"
    />
    <!-- 부서 클릭 시 해당 부서 사원 정보 로딩 -->
    <span @click="selectDepartment" class="dept-name">
      {{ props.parent.name }}
    </span>
    <!-- 하위 부서 -->
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
  padding-left: 20px; /* 들여 쓰기 */
}
.dept-item {
  display: block; /* 하위 부서가 수직으로 나열 */
}

.toggle-icon {
  width: 10px;
  height: 10px;
  vertical-align: middle; /* 이미지와 텍스트 수직 정렬 */
  margin-right: 8px; /* 이미지 오른쪽에 간격 추가 */
  cursor: pointer;
}
.dept-name {
  cursor: pointer;
  white-space: nowrap;  /* 부서명이 길어져도 줄바꿈 x */
}
</style>