import * as Vue from 'vue'
import App from './App'
import router from './router'
import projectList from './components/project_list' // 引入 project 列表组件
import Welcome from './components/welcome'
import codeView from './components/codeView'
import personView from './components/personView'
import searchProject from './components/searchProject'
import estimate from './components/estimate'
import costDriverAssess from './components/costDriverAssess'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' //样式表
import axios from 'axios'

window.$vueApp.component('project-list', projectList) // 注册组件
window.$vueApp.component('welcome', Welcome) // 注册组件
window.$vueApp.component('code-view', codeView) // 注册组件
window.$vueApp.component('person-view', personView) // 注册组件
window.$vueApp.component('search-project', searchProject) // 注册组件
window.$vueApp.component('estimate', estimate) // 注册组件
window.$vueApp.component('cost-driver-assess', costDriverAssess) // 注册组件

window.$vueApp.use(ElementUI) //使用element-ui
window.$vueApp.config.globalProperties.$axios = axios // 全局挂载

/* eslint-disable no-new */
window.$vueApp = Vue.createApp(App)
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
window.$vueApp.use(router)
window.$vueApp.mount('#app')
