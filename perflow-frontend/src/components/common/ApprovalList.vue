<script setup>
// 결재선을 표시하고 결재 순서를 변경하는 리스트

defineProps({
  approvalList: { type: Array, default: () => [] }, // 결재 목록 데이터
})
</script>

<template>
  <div class="approval-list">
    <h3>결재 순서</h3>
    <table>
      <thead>
      <tr>
        <th>결재 종류</th>
        <th>이름</th>
        <th>직위</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in approvalList" :key="index">
        <td>{{ item.type }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.position }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>