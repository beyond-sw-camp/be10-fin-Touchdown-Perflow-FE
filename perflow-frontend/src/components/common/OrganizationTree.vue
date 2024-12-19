<script setup>
import {onMounted, ref} from 'vue';
import {useStore} from '@/store/store.js';
import OrganizationNode from "@/components/common/OrganizationNode.vue";
import OrganizationSelectedEmp from "@/components/common/OrganizationSelectedEmp.vue";

const store = useStore();

const props = defineProps({
  context: {
    type: String,
    required: true  // approval or share 값 받기
  }
})

// 선택된 사원 목록
const selectedEmployees = ref([]);

const emit = defineEmits(["update:selectedApprovalEmployees", "update:selectedShareEmployees"]);

// organizationtree 에서 선택된 사원 받기
const handleSelectedEmployees = (employees) => {
  console.log(`[OrganizationTree] handleSelectedEmployees 호출. 선택된 사원 목록:`, employees);

  // selectedEmployees.value = employees;

  if (props.context === "approval") {
    console.log(`[OrganizationTree] 결재선 설정 이벤트 emit`);
    emit("update:selectedApprovalEmployees", employees); // 결재선 설정 이벤트
  } else if (props.context === "share") {
    console.log(`[OrganizationTree] 공유 설정 이벤트 emit: `, employees);
    emit("update:selectedShareEmployees", employees); // 공유 설정 이벤트
  }
};


onMounted(async () => {
  console.log(`[OrganizationTree] onMounted 호출 - 조직도 데이터 로딩`);
  await store.fetchOrg(); // Pinia를 통해 데이터를 가져옵니다.
  console.log(`[OrganizationTree] 조직도 데이터 로딩 완료`);
});

</script>
<!-- 최 상위 부서 컴포넌트 (부모) -->
<template>
  <div class="container">
    <!--  부서 트리 -->
    <div class="box left">
      <ul class="menu">
        <!--    자식 컴포넌트 (재귀로 계속해서 호출) -->
        <OrganizationNode
            v-for="dept in store.$state.allDepartment.filter(dept => !dept.managedDeptId)"
            :key=dept.deptId
            :parent = dept
        />
      </ul>
    </div>

    <!-- 사원 목록 -->
    <div class="box right">
<!--      <OrganizationSelectedEmp context="approval" @update:selectedEmployees="handleSelectedEmployees" />-->
      <OrganizationSelectedEmp
          :context="props.context"
          @update:selectedApprovalEmployees="handleSelectedEmployees"
          @update:selectedShareEmployees="handleSelectedEmployees"
      />

    </div>

  </div>

</template>

<style scoped>

.container {
  display: flex; /* Flexbox로 레이아웃 구성 */
  width: 100%;
  max-width: 800px; /* 네모 크기 고정 */
  /* max-height: 100px; */
  height: 200px;
  margin: 20px auto; /* 중앙 정렬 */
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
}

/* 공통 박스 스타일 */
.box {
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto; /* 내용이 길어지면 스크롤 */
}

/* 얇은 스크롤바 (Webkit 기반 브라우저) */
.box::-webkit-scrollbar {
  width: 6px;
}

.box::-webkit-scrollbar-thumb {
  background-color: #aaa;
  border-radius: 3px;
}

.box::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* 왼쪽 영역 (부서 트리) */
.left {
  flex: 1; /* 왼쪽 영역 50% */
  border-right: 1px solid #ddd; /* 가운데 선 추가 */
}

/* 오른쪽 영역 (사원 리스트) */
.right {
  flex: 1; /* 오른쪽 영역 50% */
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

</style>