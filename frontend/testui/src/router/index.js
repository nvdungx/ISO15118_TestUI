import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/testcases',
    name: 'testcase-list',
    component: () => import('../views/TestcaseList.vue')
  },
  {
    path: '/testcases/:id',
    name: 'testcase-detail',
    component: () => import('../views/Testcase.vue')
  },
  {
    path: "/execute",
    name: "testcase-execute",
    component: () => import("../views/TestcaseExecute.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
