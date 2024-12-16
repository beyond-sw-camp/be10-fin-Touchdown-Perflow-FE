import { createRouter, createWebHistory } from 'vue-router'
import EmpLogin from "@/views/EmpLogin.vue";


const routes = [
    // { path: '/', name: 'Home', component: Home },
     { path: '/login', name: 'Login', component: EmpLogin },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router