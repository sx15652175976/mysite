import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'

Vue.use(Router)

export default new Router({
    routes: [

        {
            mode: 'history',
            path: '/',
            name: 'GoodsList',
            component: GoodsList
        },
        {
            mode: 'history',
            path: '/Cart',
            component: Cart
        },
        {
            mode: 'history',
            path: '/Address',
            component: Address
        },
        {
            mode: 'history',
            path: '/OrderConfirm',
            component: OrderConfirm
        },
        {
            mode: 'history',
            path: '/OrderSuccess',
            component: OrderSuccess
        }
    ]
})