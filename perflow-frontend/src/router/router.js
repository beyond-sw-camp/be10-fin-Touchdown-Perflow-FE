import {createRouter, createWebHistory} from 'vue-router'
import EmpLogin from "@/views/EmpLogin.vue";
import ApprovalHome from "@/views/ApprovalHome.vue";
import TemplateBasic from "@/views/TemplateBasic.vue";
import WaitingDoc from "@/views/WaitingDoc.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },
     { path: '/login', name: 'Login', component: EmpLogin },
     { path: '/approval/home', name: 'approvalHome', component: ApprovalHome },
     { path: '/approval/create', name: 'newDoc', component: TemplateBasic },
     { path: '/approval/waiting', name: 'waitingDoc', component: WaitingDoc },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router