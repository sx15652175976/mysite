<template>
    <div>
      <Hearder />
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{ this.orderId }}</span>
              <span>Order total：{{ this.orderTotal | c('￥') }}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <!-- <a class="btn btn--m">Cart List</a>  router-link返回购物车列表页面   -->
                <router-link to="/Cart" class="btn btn--m">Cart List</router-link>
              </div>
              <div class="btn-r-wrap">
                <!-- <a class="btn btn--m">Goods List</a>  router-link返回商品列表页面  -->
                <router-link to="/" class="btn btn--m">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavFooter />
    </div>
</template>
<script>
import Hearder from '@/components/Hearder'
import NavFooter from '@/components/NavFooter'
import Modal from '@/components/Modal'
import axios from 'axios'
    export default{
        data(){
            return{
              orderId:'',//订单id
              orderTotal:0  //订单列表中商品总金额
            }
        },
        mounted() {
          var orderId = this.$route.query.orderId; //获取地址栏id
          if(!orderId){
            return false //如果id不存在 ,停止运行
          }
          axios.get('/users/orderDetail',{ params : { orderId  : orderId } }).then((res)=>{
            if(res.data.status=='0'){
              console.log(res.data)
              
              this.orderId = orderId;//如果数据成功,订单id赋值
              this.orderTotal = res.data.result.orderTotal//订单列表中商品总金额赋值
              console.log(this.orderTotal)
            }
          })
        },
        components:{
          Hearder,
          NavFooter,
          Modal
        }
    }
</script>
