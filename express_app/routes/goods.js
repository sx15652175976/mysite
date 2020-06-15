var express = require("express") //引入express框架
var router = express.Router() //调用express中的路由
var Goods = require("../model/goods_model") //引入模型


var mongoose = require("mongoose") //引入mongoose,操作数据库
mongoose.connect("mongodb://127.0.0.1/db_demo") //连接数据库
mongoose.connection.on("connected", function() { //监听
    console.log("mongodb connected success!") //成功
})
mongoose.connection.on("error", function() { //监听
    console.log("mongodb connected error!") //失败
})
mongoose.connection.on("disconnected", function() { //监听
    console.log("mongodb disconnected err!") //断开服务器
})
router.get('/list', function(req, res, next) { //根路由("/"),二级路由
        // res.send("goods list")
        let page = parseInt(req.param('page')) //获取地址栏当前页码,express方法
        let pageSize = parseInt(req.param('pageSize')) //获取地址栏的每页显示的条数,express方法
        let sort = req.param('sort') //获取地址栏中数据的排序,1(升序),-1(降序),express方法
        let skip = (page - 1) * pageSize //每页查询的初始数
        let PriceLevel = req.param('PriceLevel') //获取你要查询的价格范围
        var priceGt = '' //最小
        var priceLet = '' //最大
        var params = {}
        console.log(PriceLevel)
        if (PriceLevel != 'active') {
            switch (PriceLevel) {
                case '0':
                    priceGt = 0, priceLet = 100;
                    break;
                case '1':
                    priceGt = 100, priceLet = 500;
                    break;
                case '2':
                    priceGt = 500, priceLet = 2000;
                    break;
                case '3':
                    priceGt = 2000, priceLet = 10000;
                    break;

            }
            params = {
                    'salePrice': {
                        $gt: priceGt, //大于
                        $lte: priceLet //小于等于
                    }


                } //查询条件,必须是个对象,空对象是查询所有
        }


        let goods_model = Goods.find(params).skip(skip).limit(pageSize)
        goods_model.sort({ "salePrice": sort })
        goods_model.exec({}, function(err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    mes: err.message
                })
            } else {
                res.json({
                    status: "0",
                    mes: "",
                    result: {
                        count: doc.length,
                        list: doc
                    }
                })
            }
        })
    })
    //购物车添加
router.post("/addCart", function(req, res, next) {
    var user_model = require('../model/user_model')
    var userId = "100000077"
        //var productId = req.param('productId') //从地址栏获取到的商品id(GET方式)
    var productId = req.body.productId //从地址栏获取到的商品id(POST方式)
    user_model.findOne({ userId: userId }, function(err, userDoc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (userDoc) {
                // console.log(userDoc)
                var dataOnly = true //开关,true购物车没有添加此商品
                userDoc.cartList.forEach(function(item) {
                    if (item.productId == productId) {
                        dataOnly = false
                        item.productNum++;
                        userDoc.save(function(err1, doc1) {
                            if (err1) {
                                res.json({
                                    status: '1',
                                    msg: err1.message
                                })
                            } else {
                                res.json({
                                    status: '0',
                                    msg: '',
                                    result: 'suc'
                                })
                            }
                        })
                    }
                })
                if (dataOnly) { //用户购物车之中没有商品列表中商品时
                    Goods.findOne({ productId: productId }, function(err2, doc2) {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        } else {
                            doc2.productNum = 1
                            doc2.checked = "1"
                            userDoc.cartList.push(doc2)
                            console.log(doc2)
                            userDoc.save(function(onlyErr, docbson) {
                                if (onlyErr) {
                                    res.json({
                                        status: '1',
                                        msg: onlyErr.message
                                    })
                                } else {
                                    res.json({
                                        status: '0',
                                        msg: '',
                                        result: "suc"
                                    })
                                }
                            })
                        }
                    })
                }
            }
        }
    })
})

//
module.exports = router //暴露路由router