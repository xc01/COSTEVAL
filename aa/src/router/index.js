import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/Menu'
import codeView from '@/components/codeView'
import personView from '@/components/personView'
import estimate from '@/components/estimate'
import login from '@/components/login'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/',
      name: 'Menu',
      component: Menu,
      // redirect: '/',
      children: [
        {
          path: '/codeView',
          name: 'codeView',
          component: codeView,
          props: true
        },
        {
          path: '/personView/:pid',
          name: 'personView',
          component: personView,
          props: true
        },
        {
          path: '/estimate/:pid',
          name: 'estimate',
          component: estimate,
          props: true
        }
      ]
    }
  ]
})
