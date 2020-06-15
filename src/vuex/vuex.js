import Vue from 'vue'
import Vuex from 'vuex' //引入vuex
Vue.use(Vuex) //使用vuex
const store = new Vuex.Store({ //实例化vuex
    state: {
        nickname: '', //登录名
        cartCount: 0, //购物车中商品数量
        page: ''
    },
    mutations: { //更改state状态的
        updateUserInfo(state, nickname) { //把state传递过来的值,修改state中的nickname--修改登录名
            state.nickname = nickname
        },
        updatecartCount(state, cartCount) { //把state传递过来的值,修改state中的nickname--修改购物车数量
            state.cartCount += cartCount //传递过来的数量进行加减
        },
        initCartCount(state, cartCount) { //初始化  购物车中商品数量
            state.cartCount = cartCount
        },
        updatePage(state, page) { //当前页修改page的状态,来判断具体是哪个组件(页面)
            state.page = page
        }
    }

})
export default store //到处store