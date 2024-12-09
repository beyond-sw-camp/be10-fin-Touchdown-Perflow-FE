import { defineStore } from 'pinia';
import {ref} from "vue";
import api from "@/config/axios.js";

export const useStore = defineStore('store', {
    state: () => ({
        allDepartment: ref([])
    }),
    actions: {
        // 조직도 갱신
        async fetchOrg() {
            this.allDepartment = (await api.get("/hr/departments/list")).data;
        }
    }
});