<template>
 <div> 
     <div class="mask_layer" id="mask_layer" v-show="price_mask_issshow"></div>
     <Header />
     <nav-wrap></nav-wrap>

    <div class="accessory-result-page accessory-page">
        <div class="container">
            <div class="filter-nav">
                <span class="sortby">Sort by:</span>
                <a href="javascript:void(0)" class="default cur" >Default</a>
                <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short"></use>
          </svg></a>
                <a href="javascript:void(0)" class="filterby stopPop" @click="price_menu()">Filter by</a>
            </div>
            <div class="accessory-result">
                <!-- filter -->
                <div class="filter stopPop" id="filter"
                    v-bind:class="{'filterby-show':price_menu_issshow}"
                >
                    <dl class="filter-price">
                        <dt>Price:</dt>
                        <dd>
                            <a href="javascript:void(0)"
                                v-bind:class="{'cur':PriceState_all=='active'}"
                                @click="PriceState_status_all"
                            >All</a>
                        </dd>
                        <dd v-for="(item, index) in PriceFilter" :key="index">
                            <a href="javascript:void(0)"
                                @click="PriceState_set(index)"
                                v-bind:class="{'cur':PriceState_all==index}"
                            >{{ item.startPrice }}--{{ item.endPrice }}</a>
                        </dd>
                    </dl>
                </div >

                <!-- search result accessories list -->
                <div class="accessory-list-wrap">
                    <div class="accessory-list col-4">
                        <ul>
                            <li v-for="(item, index) in goodsList" :key="index" >
                                <div class="pic">
                                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                                </div>
                                <div class="main">
                                    <div class="name">{{ item.productName }}</div>
                                    <div class="price">{{ item.salePrice }}</div>
                                    <div class="btn-area">
                                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                    </div>
                                </div>
                            </li>
                            
                        </ul>
                        <div v-infinite-scroll="loayScroll" infinite-scroll-disabled="buay" infinite-scroll-distance="10" class="good_load" >
                            <!-- v-infinite-scroll(鼠标滚动事件)
                            infinite-scroll-disabled(鼠标是否滚动,禁用)
                            infinite-scroll-distance(本div距离页面底部的距离) -->

                            <img v-show="imgtr" src="/static/loading-svg/loading-spin.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal"><!-- 自定义事件 -->
        <p slot="message">请先登录,否则无法加入购物车</p>
        <div slot="btnGroup">

            <a class="btn btn-m">关闭</a>
            <!-- 没有登录时,只能关闭 -->
        </div>

    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal"><!-- 自定义事件 -->
        <p slot="message">加入购物车成功</p>
        <div slot="btnGroup">
            <a class="btn btn-m" @click="mdShowCart=false">继续购物</a>
            <router-link class="btn btn-m" to="/Cart">查看购物车</router-link>
            <!-- 没有登录时,只能关闭 -->
        </div>

    </Modal>
    <nav-footer></nav-footer>
 </div>
</template>

<script>
import "@/assets/css/base.css";
import "@/assets/css/login.css";
import "@/assets/css/product.css";
import "@/assets/css/checkout.css";
import Header from '@/components/Hearder'
import NavWrap from '@/components/NavWrap'
import NavFooter from '@/components/NavFooter'
import axios from 'axios'
import Modal from '@/components/Modal'


export default {
    data(){
        return{
            mdShowCart:false, //已经购物,模态框(隐藏)
            mdShow:false,//默认模态框是隐藏
            page: 1,//页数
            pageSize: 4,//每页显现的条数
            buay: true,//鼠标滚动时,是否触发  true为禁用,false为启用
            sortFlag: false,//升序降序的开关
            imgtr:false,

            goodsList:[],
            PriceFilter:[
                { startPrice : "0" , endPrice : "100" },
                { startPrice : "100" , endPrice : "500" },
                { startPrice : "500" , endPrice : "2000" },
                { startPrice : "2000" , endPrice : "10000" }
            ],
            PriceState_all:"active",
            price_menu_issshow:true,
            price_mask_issshow:false
        }
    },
    mounted() { //初始化(页面加载完成之后)
        this.getGoodsList()
    },
    methods:{
        // getGoodsList(){
        //     axios.get('/api/goods').then(
        //         res=>{
        //             console.log(res.data.goodslist.result)
        //             this.goodsList=res.data.goodslist.result
        //         }
        //     )
        // },
        closeModal(){
            this.mdShow=false//触发该方法,关闭对话框
            this.mdShowCart=false
        },
        addCart(productId){ //添加购物车
            axios.post('/goods/addCart',{productId:productId}).then((res)=>{
                // if( res.data.status=='0'){
                //     alert('添加成功')
                // }else{
                //     alert('添加失败')
                // }
                //res.data.status=='0'? this.mdShowCart=true:this.mdShow=true
                //mdShow会往上传递,传递到Modal组件上
                if(res.data.status=='0'){
                    this.mdShowCart = true //添加购物车中商品,数量+1
                    this.$store.commit('updatecartCount',1)
                }else{
                    this.mdShow = true
                }
            })
        },
        sortGoods(){
            this.sortFlag=!this.sortFlag;//取反
            this.page=1;//保证每次点击对应的价格,是从第一页开始查询
            this.getGoodsList();//每次点击后,执行getGoodsList开始查询

        },
        loayScroll(){//定时器(页面的效果,用户体验更佳)
            setTimeout(()=>{
                this.page++;
                this.getGoodsList(true)//传个参数
            },2000)
        },
         getGoodsList(flag){//接个参数
            this.$store.commit('updatePage','')//商品列表,给vuex中的state.page赋值为空''

         //滑动的时候 flag true
            this.imgtr = true;//当请求时显示
             var pageConf={
                 PriceLevel:this.PriceState_all,//active,1,2,3,4......告知你要查询的价格

                 page : this.page,
                 pageSize : this.pageSize,
                 sort : this.sortFlag ? 1 :-1,
                 
             }
            axios.get('/goods/list',{params:pageConf}).then(
                res=>{
                    console.log(res.data.result.list)
                    
                    if(res.data.status == "0"){
                        // this.goodsList=res.data.result.list
                        if(flag){
                            this.goodsList=this.goodsList.concat(res.data.result.list)
                            if(res.data.result.list.count==0){
                                this.buay=true
                            }
                        }else{
                                this.goodsList=res.data.result.list
                                this.buay=false
                            }
                        this.imgtr = false
                    }else{
                        this.goodsList = []
                    }
                }
                
            )
        },
        price_menu(){
            this.price_menu_issshow=true;
            this.price_mask_issshow=true
        },
        PriceState_set(index){
            this.page=1;//保证每次点击对应的价格,是从第一页开始查询
            this.PriceState_all=index;
            this.price_menu_issshow=false;
            this.price_mask_issshow=false;
            console.log(this.PriceState_all)
            this.getGoodsList();//每次点击后,执行getGoodsList开始查询

        },
        PriceState_status_all(){
            this.page=1;//保证每次点击对应的价格,是从第一页开始查询

            this.PriceState_all="active";
            this.price_menu_issshow=false;
            this.price_mask_issshow=false
            this.getGoodsList();//每次点击后,执行getGoodsList开始查询
            
        }
    },
    components:{
        Header,
        NavWrap,
        NavFooter,
        Modal
    }
};
</script>

<style scoped>
.mask_layer{width: 100vw;height: 100vh;background-color: rgba(0,0,0,0.3);position: fixed;z-index: 1;}
.good_load{height: 100px;text-align: center;line-height: 100px;}
</style>