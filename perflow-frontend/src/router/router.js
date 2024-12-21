import {createRouter, createWebHistory} from 'vue-router'
import EmpLogin from "@/views/hr/employee/EmpLogin.vue";
import WorkStatus from "@/views/Attitude/WorkStatusForHRWeek.vue";
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
import PersonalKPIView from "@/views/performance/PersonalKPIView.vue";
import TeamKPIView from "@/views/performance/TeamKPIView.vue";
import EmpListRegister from "@/views/hr/employee/EmpListRegister.vue";
import PayrollList from "@/views/payment/PayrollList.vue";
import EmpMyPage from "@/views/hr/employee/EmpMyPage.vue";
import AnnList from "@/views/announcement/AnnList.vue";
import EmpPwdRegister from "@/views/hr/employee/EmpPwdRegister.vue";
import EmpRegister from "@/views/hr/employee/EmpRegister.vue";
import MainPage from "@/views/MainPage.vue";
import PositionList from "@/views/hr/employee/JobList.vue";
import JobList from "@/views/hr/employee/JobList.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },

    {path: '/', name: 'LoginPage', component: EmpLogin},
    {path: '/login', name: 'Login', component: EmpLogin},
    {path: '/hr/my-page', name: 'myPage', component: EmpMyPage},
    // 인사
    {path: '/hr/employees', name: 'EmpList', component: EmpList},
    {path: '/hr/employees/register', name: 'EmpRegister', component: EmpRegister},
    {path: '/hr/job', name: 'PositionList', component: JobList},
    {path: '/employees/pwd', name: 'EmpPwdRegister', component: EmpPwdRegister},
    {path: '/employees/pwd', name: 'EmpPwdRegister', component: EmpPwdRegister},

    {path: '/approval/home', name: 'approvalHome', component: ApprovalHome},
    {path: '/approval/create', name: 'newDoc', component: TemplateBasic},
    {path: '/performance/personal-kpi', name: 'personalKPI', component: PersonalKPIView},
    {path: '/performance/team-kpi', name: 'teamKPI', component: TeamKPIView},
    {path: '/approval/waiting', name: 'waitingDoc', component: WaitingDoc},
    {path: '/payment/payroll', name: 'Payroll', component: PayrollList},
    {path: '/main-page', name: 'MainPage', component: MainPage},
    //근태
    {path:'/attitude/work-status',name:'workStatus',component:WorkStatus},
    {path:'/attitude/work-hours',name:'workHours',component:WorkHours},
    {path:'/attitude/vacation',name:'vacation',component:Vacation},
    {path:'/attitude/annual',name:'annual',component:Annual},
    {path:'/attitude/overtime',name:'overtime',component:Overtime},
    {path:'/attitude/travel',name:'travel',component:Travel},
    {path:'/attitude/attendance-status',name:'attendance-status',component:AttendanceStatus},
    {path:'/announcements', name: 'announcements-list', component: AnnList}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    // 라우팅 시 화면 최 상단으로 이동됨.
    scrollBehavior(to, from, savedPosition) {
        // savedPosition이 있는 경우(예: 뒤로 가기), 해당 위치로 이동
        if (savedPosition) {
            return savedPosition;
        } else {
            // 새로운 페이지 이동 시 맨 위로 스크롤
            return { top: 0 };
        }
    }
})

export default router