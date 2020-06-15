// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' //引入vue
import App from './App' //入口文件
import router from './router' //引入路由
import lazyload from 'vue-lazyload' //导入懒加载
import infiniteScroll from 'vue-infinite-scroll' //导入滚动插件
import { currency } from '@/money/currency' //引入过滤器
import store from '@/vuex/vuex.js' //引入vuex
// import Vuex from 'vuex' //引入vuex
// Vue.use(Vuex) //使用vuex
// const store = new Vuex.Store({ //实例化vuex
//     state: {
//         nickname: '', //登录名
//         cartCount: 0 //购物车中商品数量
//     }

// })



Vue.config.productionTip = false
Vue.use(infiniteScroll) //使用滚动插件
Vue.filter('c', currency) //金钱的 过滤器  | c("￥")
Vue.use(lazyload, { //使用懒加载(没有数据时,那些动画,转圈圈)
    loading: "/static/loading-svg/loading-cylon.svg"
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router, //把路由映射到vue实例中
    store, //将store(实例化的vuex)注册到vue实例中,这时候vue中的所以组件都具备了store中的所有功能
    components: { App },
    template: '<App/>'
})