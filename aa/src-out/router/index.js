import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import Menu from '@/components/Menu'
import codeView from '@/components/codeView'
import personView from '@/components/personView'
import estimate from '@/components/estimate'

export default VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: [
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
          props: true,
        },
        {
          path: '/personView/:pid',
          name: 'personView',
          component: personView,
          props: true,
        },
        {
          path: '/estimate/:pid',
          name: 'estimate',
          component: estimate,
          props: true,
        },
      ],
    },
  ],
})
