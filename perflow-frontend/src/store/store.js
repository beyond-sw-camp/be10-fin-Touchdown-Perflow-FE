import {defineStore} from 'pinia';
import {computed, ref} from "vue";
import api from "@/config/axios.js";

export const useStore = defineStore('store', {
    state: () => ({
        allDepartment: ref([]),
        allEmployee: ref({}),
        allMenu: ref([]),
        company: ref({}),
    }),
    actions: {
        // 조직도 갱신
        async fetchOrg() {
            this.allDepartment = (await api.get("/hr/departments/list")).data;
        },
        // 선택 부서 사원 추가
        async addEmp(deptId) {
            const response = await api.get("/employees/depts", {
                params: {
                    departmentId: deptId // 숫자로 전송
                }
            });

            // allEmployee.value가 정의되지 않았으면 초기화
            if (!this.allEmployee.value) {
                this.allEmployee.value = {};
            }

            this.allEmployee.value[deptId] = response.data; // 객체로 저장
        },
        // 선택 부서 사원 삭제
        async removeEmp(deptId) {
            delete this.allEmployee.value[deptId]; // 객체에서 해당 키 삭제
        },
        async fetchMenu(){
            this.allMenu = (await api.get("/menu")).data;
        },
        async fetchCompany() {
            this.company = (await api.get("/company")).data;
            console.log(this.company);
        }
    }
});