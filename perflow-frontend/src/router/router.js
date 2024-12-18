import {createRouter, createWebHistory} from 'vue-router'
import EmpLogin from "@/views/hr/employee/EmpLogin.vue";
import ApprovalHome from "@/views/ApprovalHome.vue";
import newDoc from "@/views/newDoc.vue";
import TemplateBasic from "@/views/TemplateBasic.vue";
import EmpList from "@/views/hr/employee/EmpList.vue";
import EmpListRegister from "@/views/hr/employee/EmpListRegister.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },

    {path: '/', name: 'mainPage', component: EmpLogin},
    {path: '/login', name: 'Login', component: EmpLogin},
    {path: '/hr/employees', name: 'EmpList', component: EmpList},
    {path: '/hr/employees/register/lists', name: 'EmpListRegister', component: EmpListRegister},
    {path: '/approval/home', name: 'approvalHome', component: ApprovalHome},
    {path: '/approval/create', name: 'newDoc', component: TemplateBasic},

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router