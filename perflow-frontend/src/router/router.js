import { createRouter, createWebHistory } from 'vue-router'
import EmpLogin from "@/views/EmpLogin.vue";
import ApprovalHome from "@/views/ApprovalHome.vue";
import newDoc from "@/views/newDoc.vue";
import TemplateBasic from "@/views/TemplateBasic.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },
     { path: '/login', name: 'Login', component: EmpLogin },
     { path: '/approval/home', name: 'approvalHome', component: ApprovalHome },
     { path: '/approval/create', name: 'newDoc', component: TemplateBasic },


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router