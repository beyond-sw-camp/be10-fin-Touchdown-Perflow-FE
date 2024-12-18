import {createRouter, createWebHistory} from 'vue-router'
import EmpLogin from "@/views/hr/employee/EmpLogin.vue";
import ApprovalHome from "@/views/approval/ApprovalHome.vue";
import TemplateBasic from "@/views/approval/TemplateBasic.vue";
import WaitingDoc from "@/views/approval/WaitingDoc.vue";
import EmpList from "@/views/hr/employee/EmpList.vue";
import PayrollList from "@/views/payment/PayrollList.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },

    {path: '/', name: 'mainPage', component: EmpLogin},
    {path: '/login', name: 'Login', component: EmpLogin},
    {path: '/hr/employees', name: 'EmpList', component: EmpList},
    {path: '/approval/home', name: 'approvalHome', component: ApprovalHome},
    {path: '/approval/create', name: 'newDoc', component: TemplateBasic},
    {path: '/approval/waiting', name: 'waitingDoc', component: WaitingDoc},
    {path: '/payment/payroll', name: 'Payroll', component: PayrollList},


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router