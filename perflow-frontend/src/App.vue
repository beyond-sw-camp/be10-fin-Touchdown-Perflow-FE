<script setup>
import SideMenuTree from "@/components/common/SideMenuTree.vue";

const columns = [
  { label: "문서번호", field: "id" },
  { label: "문서번호", field: "docId" },
  { label: "서식", field: "template" },
  { label: "제목", field: "title" },
  { label: "결재선", field: "approvalLine" },
  { label: "작성일", field: "date" },
  { label: "작성자", field: "author" },
  { label: "", field: "update" },
  { label: "", field: "delete" },
];

const rows = [
  { id: 1, docId: "2024-LAB001-001", template: "초과근로신청서", title: "개발1팀_홍길동_초과근로신청서_20241204", approvalLine: "결재1-결재2-결재3", date: "2024.12.04 15:28", author: "홍길동", update: "*", delete: "+"},
  { id: 2, docId: "2024-LAB001-001", template: "초과근로신청서", title: "개발1팀_홍길동_초과근로신청서_20241204", approvalLine: "결재1-결재2-결재3", date: "2024.12.04 15:28", author: "홍길동", update: "*", delete: "+"},
  { id: 3, docId: "2024-LAB001-001", template: "초과근로신청서", title: "개발1팀_홍길동_초과근로신청서_20241204", approvalLine: "결재1-결재2-결재3", date: "2024.12.04 15:28", author: "홍길동", update: "*", delete: "+"},
];
</script>

<template>
<!--  <p>*버튼 예시</p>-->
<!--  <ButtonBasic color="orange" label="기본 버튼1"/>-->
<!--  <ButtonBasic color="gray" label="기본 버튼2"/>-->
<!--  <br>-->
<!--  <ButtonBasic size="medium" label="기본 버튼3"/>-->
<!--  <br>-->
<!--  <ButtonBasic size="large" label="기본 버튼4"/>-->
<!--  <br>-->
<!--  <br>-->
<!--  <p>*표 예시</p>-->
<!--  <br>-->
<!--  <TableBasic :row-key="'id'" :rows="rows" :columns="columns" />-->
  <SideMenuTree/>
  <router-view/>
</template>

<style scoped>

</style>
