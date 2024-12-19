import {createRouter, createWebHistory} from 'vue-router'
import EmpLogin from "@/views/hr/employee/EmpLogin.vue";
import WorkStatus from "@/views/Attitude/WorkStatus.vue";
import WorkHours from "@/views/Attitude/WorkHours.vue";
import Vacation from "@/views/Attitude/Vacation.vue";
import Annual from "@/views/Attitude/Annual.vue";
import Overtime from "@/views/Attitude/Overtime.vue";
import AttendanceStatus from "@/views/Attitude/AttendanceStatus.vue";
import Travel from "@/views/Attitude/Travel.vue";
import ApprovalHome from "@/views/approval/ApprovalHome.vue";
import TemplateBasic from "@/views/approval/TemplateBasic.vue";
import WaitingDoc from "@/views/approval/WaitingDoc.vue";
import EmpList from "@/views/hr/employee/EmpList.vue";
import EmpListRegister from "@/views/hr/employee/EmpListRegister.vue";
import PayrollList from "@/views/payment/PayrollList.vue";
import EmpMyPage from "@/views/hr/employee/EmpMyPage.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },

    {path: '/', name: 'mainPage', component: EmpLogin},
    {path: '/login', name: 'Login', component: EmpLogin},
    {path: '/hr/myPage', name: 'myPage', component: EmpMyPage},
    {path: '/hr/employees', name: 'EmpList', component: EmpList},
    {path: '/hr/employees/register/lists', name: 'EmpListRegister', component: EmpListRegister},
    {path: '/approval/home', name: 'approvalHome', component: ApprovalHome},
    {path: '/approval/create', name: 'newDoc', component: TemplateBasic},
    {path: '/approval/waiting', name: 'waitingDoc', component: WaitingDoc},
    {path: '/payment/payroll', name: 'Payroll', component: PayrollList},
    //근태
    {path:'/attitude/work-status',name:'workStatus',component:WorkStatus},
    {path:'/attitude/work-hours',name:'workHours',component:WorkHours},
    {path:'/attitude/vacation',name:'vacation',component:Vacation},
    {path:'/attitude/annual',name:'annual',component:Annual},
    {path:'/attitude/overtime',name:'overtime',component:Overtime},
    {path:'/attitude/travel',name:'travel',component:Travel},
    {path:'/attitude/attendance-status',name:'attendance-status',component:AttendanceStatus}

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router