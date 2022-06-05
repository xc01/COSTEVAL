import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
 
import Login from '../components/views/Login.vue'
import Logout from '../components/views/Logout.vue'
import Search from '../components/views/Search.vue'
import Analyse from '../components/views/Analyse.vue'
import Audit from '../components/views/Audit.vue'
import Home from '../components/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/search',
        name: 'Search',
        component: Search
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/logout',
        name: 'Logout',
        component: Logout
    },
    {
        path: '/analyse',
        name: 'Analyse',
        component: Analyse
    },
    {
        path: '/audit',
        name: 'Audit',
        component: Audit
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
 
export default router