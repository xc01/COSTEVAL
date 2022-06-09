// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import projectList from './components/project_list' // 引入 project 列表组件
import Welcome from './components/welcome'
import codeView from './components/codeView'
import personView from './components/personView'
import searchProject from './components/searchProject'
import estimate from './components/estimate'
import costDriverAssess from './components/costDriverAssess'
import login from './components/login'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'   //样式表
import axios, { Axios } from 'axios'

Vue.config.productionTip = false
Vue.component('project-list', projectList)  // 注册组件
Vue.component('welcome', Welcome)  // 注册组件
Vue.component('code-view', codeView)  // 注册组件
Vue.component('person-view', personView)  // 注册组件
Vue.component('search-project', searchProject)  // 注册组件
Vue.component('estimate', estimate)  // 注册组件
Vue.component('cost-driver-assess', costDriverAssess)  // 注册组件
Vue.component('login', login)  // 注册组件



Vue.use(ElementUI) //使用element-ui
Vue.prototype.$axios = axios // 全局挂载

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
