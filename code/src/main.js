import Vue from 'vue'
import App from './App.vue'
import router from './router'
import'./assets/css/reset.css'
import'./assets/css/common.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs'
import echarts from 'echarts'

router.beforeEach((to,from,next)=>{
  let token=window.localStorage.getItem("token");
  if(token){
    next();
  }else{
    if(to.path === "/login"){
      next();
    }else{
      next({path:"/login"});
    }
  }
  
});
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.axios = axios;
Vue.prototype.qs = qs;
Vue.prototype.echarts = echarts;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
