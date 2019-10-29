// imports
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import Home from './components/Home'
import VuePageTransition from 'vue-page-transition'
import NewEstimate from './components/NewEstimate'
import VueRouter from 'vue-router'

// css-specific imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './styles/_palette.scss'
import './styles/font-averta-std.css'

// config
Vue.config.productionTip = false

// middleware
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VuePageTransition)

// router
const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/new-est', component: NewEstimate }
  ]
})

// app instance
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
