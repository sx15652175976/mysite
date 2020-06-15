//引入express框架
var express = require('express');
//使用express框架中的路由
var router = express.Router();
//导入db_demo中的user数据表
var User = require('../model/user_model');
//引入日期格式化工具
require('../util/util')

/* GET users listing. */ //生成脚手架时(自带)
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//登录
router.post("/login", function(req, res, next) {
        var param = { //获取从前端提交过来的值
            // userName: req.param('userName'),GET方式
            // userPwd: req.param('userPass')
            userName: req.param('userName'), //POST方式
            userPwd: req.param('userPwd')
        }
        User.findOne(param, function(err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message
                })
            } else {
                if (doc) {
                    res.cookie("userId", doc.userId, { //用户id
                        path: "/", //cookie设置的范围 
                        maxAge: 1000 * 60 * 60 //cookie设置的保存时间
                    })
                    res.cookie("userName", doc.userName, { //用户名
                        path: "/", //cookie设置的范围
                        maxAge: 1000 * 60 * 60 //cookie设置的保存时间
                    })
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            userName: doc.userName
                        }
                    })
                } else {
                    res.json({
                        status: '1',
                        msg: "err"
                    })
                }
            }
        })

    })
    //登录状态
router.get("/checkLogin", function(req, res, next) { //定义一个判断登录状态的路由
        if (req.cookies.userId) { //如果监测到cookie中有userId时,返回状态0
            res.json({
                status: '0',
                msg: '',
                result: req.cookies.userName
            })
        } else {
            res.json({
                status: '1',
                msg: '未登录',
                result: ''
            })
        }
    })
    //退出登录
router.post('/logout', function(req, res, next) {
        res.cookie('userId', '', {
            path: '/',
            maxAge: -1
        })
        res.json({
            status: '0',
            msg: '',
            result: ''
        })
    })
    //查询当前用户购物车,登陆后才能查询
router.get('/cartList', function(req, res) {
    var userId = req.cookies.userId;
    User.findOne({
        userId: userId
    }, function(err, doc) { //如果监测到cookie中的userId用户
        if (err) {
            res.json({
                status: '1',
                msg: err.message, //系统提供
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
})

//删除购物车被勾选的商品
router.post('/cartDel', function(req, res, next) {
        var userId = req.cookies.userId; //用户id
        var productId = req.body.productId; //商品id
        User.update({
            userId: userId
        }, {
            $pull: {
                'cartList': {
                    productId: productId
                }
            }
        }, function(err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message, //系统提供
                    result: ''
                })
            } else {
                res.json({
                    status: '0',
                    msg: '',
                    result: 'suc'
                })
            }
        })
    })
    //更新购物车商品数量
router.post('/cartEnit', function(req, res, next) {
        var userId = req.cookies.userId //用户id
        var productId = req.body.productid //商品id
        var productNum = req.body.productNum //商品数量
        var checked = req.body.checked //商品选中状态
        User.update({
                "userId": userId,
                "cartList.productId": productId
            }, //条件
            {
                "cartList.$.productNum": productNum, //要更新的内容,cartList.$.productNum(占位符)
                "cartList.$.checked": checked //要更新的内容,cartList.$.checked(占位符)
            },
            function(err, doc) {
                if (err) {
                    res.json({
                        status: '1',
                        msg: err.message, //系统提供
                        result: ''
                    })
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: 'suc'
                    })
                }
            }
        )
    })
    //是否全选
router.post('/editCheckAll', function(req, res, next) {
        var userId = req.cookies.userId //用户id
        var checkAll = req.body.checkAll ? '1' : '0' //获取从前端传过来的状态,是否是全选还是不选
            // console.log(checkAll)
        User.findOne({
            userId: userId
        }, function(err, userTable) { //根据用户id查找用户所有的数据
            if (err) {
                res.json({
                    status: '1',
                    mes: err.message,
                    result: ''
                })
            } else {
                if (userTable) {
                    userTable.cartList.forEach(item => { //遍历,修改(未更新)
                        item.checked = checkAll
                    })
                }
                userTable.save(function(err, doc) { //更新后的数据保存到数据库(save)
                    if (err) {
                        res.json({
                            status: '1',
                            msg: err.message, //系统提供
                            result: ''
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
    })
    //Address地址查询
router.get('/AddressList', function(req, res, next) {
        var userId = req.cookies.userId //用户id
        User.findOne({
            userId: userId
        }, function(err, doc) { //根据用户id查找用户所有的数据
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message, //系统提供
                    result: ''
                })
            } else {
                if (doc) {
                    res.json({
                        status: '0',
                        msg: '',
                        result: doc.addressList //如果成功的话,给前台返回地址列表
                    })
                }
            }
        })
    })
    //设置默认发货地址
router.post('/setAddress', function(req, res, next) {
        var userId = req.cookies.userId //用户id
        var addressId = req.body.addressId //地址id
            // console.log(addressId)
        User.findOne({
            userId: userId
        }, function(err, doc) { //根据用户id查找用户所有的数据
            // console.log(doc)
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message, //系统提供
                    result: ''
                })
            } else {
                var addressList = doc.addressList //根据用户id找到他的地址列表
                addressList.forEach((item) => { //循环出来地址列表中的所有数据
                    if (item.addressId == addressId) {
                        item.isDefault = true
                    } else {
                        item.isDefault = false
                    }
                })
                doc.save(function(err, doc1) {
                    if (err) {
                        res.json({
                            status: '1',
                            msg: err.message, //系统提供
                            result: ''
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
    })
    //删除地址
router.post('/AddressDel', function(req, res, next) {
    var userId = req.cookies.userId; //用户id
    var addressId = req.body.addressId; //地址id
    User.update({
        userId: userId
    }, {
        $pull: {
            'addressList': {
                addressId: addressId
            }
        }
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message, //系统提供
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: 'suc'
            })
        }
    })
})

//添加地址路由
router.post('/addAddress', function(req, res, next) {
    var userId = req.cookies.userId; //用户id
    // console.log(req.body)
    User.findOne({
        userId: userId
    }, function(err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message, //系统提供
                result: ''
            })
        } else {
            if (doc) {
                doc.addressList.push(req.body)
                doc.save(function(errSave, doc1) {
                    if (errSave) {
                        res.json({
                            status: '1',
                            msg: err.message, //系统提供
                            result: ''
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
        }
    })
})

//请求订单列表
// router.get('/OrderList', function(req, res, next) {
//     var userId = req.cookies.userId //用户id
//     User.findOne({ userId: userId }, function(err, doc) { //根据用户id查找用户所有的数据
//         if (err) {
//             res.json({
//                 status: '1',
//                 msg: err.message, //系统提供
//                 result: ''
//             })
//         } else {
//             if (doc) {
//                 res.json({
//                     status: '0',
//                     msg: '',
//                     result: doc.orderList //如果成功的话,给前台返回地址列表
//                 })
//             }
//         }
//     })
// })

//生成订单
router.post('/payMent', function(req, res, next) {
        var userId = req.cookies.userId, //用户id
            addressId = req.body.addressId, //地址id
            orderTotal = req.body.orderTotal //订单总金额
            // console.log(orderTotal)
        User.findOne({
            userId: userId
        }, function(err, doc) { //查询用户所有数据
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message, //系统提供
                    result: ''
                })
            } else {
                var address = '',
                    goodsList = [] //地址和商品列表
                    //获取用户的地址信息
                    // console.log(doc.addressList)
                doc.addressList.forEach((item) => {
                        if (addressId == item.addressId) { //如果前端传递过来的地址id和数据库中的地址id相同
                            address = item
                        }
                    })
                    //获取用户的购物车中勾选到的商品
                doc.cartList.filter((item) => { //过滤
                        if (item.checked == '1') { //购物车中已经勾选的商品
                            goodsList.push(item)
                        }
                    })
                    //订单号
                var platform = '328', //平台号
                    r1 = Math.floor(Math.random() * 10), //随机数(防止订单号重复)
                    r2 = Math.floor(Math.random() * 10), //随机数(防止订单号重复)
                    sysDate = new Date().Format('yyyyMMddhhmmss'), //时间(调用了插件的格式化日期)
                    CreateDate = new Date().Format('yyyy-MM-dd hh-mm-ss') //创建了订单号生成的日期
                var orderId = platform + r1 + sysDate + r2 //(订单号)

                //封装成个对象入库
                var order = {
                    orderId: orderId, //订单号
                    orderTotal: orderTotal, //总金额
                    addressInfo: address, //地址(所有)
                    goodsList: goodsList, //商品(所有)订单的商品
                    orderStatus: '1', //状态码
                    createDate: CreateDate //日期
                }
                doc.orderList.push(order) //添加订单到订单列表
                doc.save(function(errOne, docOne) {
                    if (errOne) {
                        res.json({
                            status: '1',
                            msg: errOne.message, //系统提供
                            result: ''
                        })
                    } else {
                        res.json({
                                status: '0',
                                msg: '',
                                result: {
                                    orderId: order.orderId, //后台传输给前台的订单信息
                                    orderTotal: order.orderTotal //订单商品总金额
                                }
                            })
                            //订单成功之后,回调文档
                        var productIdList = []; //购物车中结算商品列表(可能是一个,也可能是多个商品)
                        doc.orderList.forEach(item => { //循环整个订单列表
                            if (item.orderId == order.orderId) { //如果订单的id和生成的订单id一致,说明商品就是订单列表中的
                                item.goodsList.forEach(item => { //循环订单匹配的商品
                                    productIdList.push(item.productId) //把订单中的商品id添加到结算订单列表中
                                })
                            }
                        });
                        productIdList = [...new Set(productIdList)]; //数组去重方法( [...new Set(Array)]  )  订单的商品id
                        //console.log(product_Arr) //商品的id
                        productIdList.forEach(item => { //循环删除
                            console.log(item);
                            User.update( //更新
                                {
                                    userId: userId
                                }, {
                                    $pull: {
                                        'cartList': {
                                            'productId': item
                                        }
                                    }
                                }, //更新一个删除方法,删除cartList中的productId为获取的productId
                                function(err, doc) {})
                        });
                    }
                })

            }
        })

    })
    //根据订单id,查询订单信息
router.get('/orderDetail', function(req, res, next) {
        var userId = req.cookies.userId; //谁的订单
        var orderId = req.param('orderId'); //订单id
        User.findOne({
            userId: userId
        }, function(err, userInfo) {
            if (err) {
                res.json({
                    status: "1",
                    msg: msg.message,
                    result: ''
                })
            } else {
                var orderList = userInfo.orderList //获取订单列表
                    // console.log(orderList)
                if (orderList.length > 0) { //如果订单列表长度大于0
                    var orderTotal = 0 //订单中商品的总金额
                    orderList.forEach((item) => {
                            if (item.orderId == orderId) { //查询地址栏订单id与数据库中订单id是否一致
                                orderTotal = item.orderTotal //地址栏订单id与数据库中订单id一致,得到此订单商品总金额
                                    // console.log(item.orderId == orderId)
                            }
                        })
                        // console.log(orderTotal)
                    if (orderTotal > 0) {
                        res.json({
                            status: "0",
                            msg: '',
                            result: {
                                orderId: orderId,
                                orderTotal: orderTotal
                            }
                        })
                    }
                } else {
                    res.json({
                        status: '1',
                        msg: '当前用户没有登录',
                        result: ''
                    })
                }
            }
        })
    })
    //购物车中商品数量
router.get('/getCartCount', function(req, res, next) {
    if (req.cookies.userId) {
        // console.log(req.cookies.userId)
        var userId = req.cookies.userId; //用户登录之后,用户的id
        User.findOne({
            userId
        }, function(err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: 'err'
                })
            } else {
                let cartList = doc.cartList //拿到购物车列表
                let cartCount = 0 //默认购物车中商品数量为0
                cartList.map(function(item) { // forEach也可以
                    cartCount += parseInt(item.productNum) //购物车数量累加

                })
                res.json({
                    status: '0',
                    msg: '',
                    result: cartCount
                })
            }
        })
    }
})

//暴露router
module.exports = router;



//生成订单
// router.post('/payMent', function(req, res, next) {
//     var userId = req.cookies.userId, //用户id
//         addressId = req.body.addressId, //地址id
//         orderTotal = req.body.orderTotal //订单总金额
//         // console.log(orderTotal)
//     User.findOne({ userId: userId }, function(err, doc) { //查询用户所有数据
//         if (err) {
//             res.json({
//                 status: '1',
//                 msg: err.message, //系统提供
//                 result: ''
//             })
//         } else {
//             var address = '',
//                 goodsList = [] //地址和商品列表
//                 //获取用户的地址信息
//                 // console.log(doc.addressList)
//             doc.addressList.forEach((item) => {
//                     if (addressId == item.addressId) { //如果前端传递过来的地址id和数据库中的地址id相同
//                         address = item
//                     }
//                 })
//                 //获取用户的购物车中勾选到的商品
//             doc.cartList.filter((item) => { //过滤
//                     if (item.checked == '1') { //购物车中已经勾选的商品
//                         goodsList.push(item)
//                     }
//                 })
//                 //订单号
//             var platform = '328', //平台号
//                 r1 = Math.floor(Math.random() * 10), //随机数(防止订单号重复)
//                 r2 = Math.floor(Math.random() * 10), //随机数(防止订单号重复)
//                 sysDate = new Date().Format('yyyyMMddhhmmss'), //时间(调用了插件的格式化日期)
//                 CreateDate = new Date().Format('yyyy-MM-dd hh-mm-ss') //创建了订单号生成的日期
//             var orderId = platform + r1 + sysDate + r2 //(订单号)

//             //封装成个对象入库
//             var order = {
//                 orderId: orderId, //订单号
//                 orderTotal: orderTotal, //总金额
//                 addressInfo: address, //地址(所有)
//                 goodsList: goodsList, //商品(所有)
//                 orderStatus: '1', //状态码
//                 createDate: CreateDate //日期
//             }
//             doc.orderList.push(order) //添加订单到订单列表
//             doc.save(function(errOne, docOne) {
//                 if (errOne) {
//                     res.json({
//                         status: '1',
//                         msg: errOne.message, //系统提供
//                         result: ''
//                     })
//                 } else {
//                     res.json({
//                         status: '0',
//                         msg: '',
//                         result: {
//                             orderId: order.orderId, //后台传输给前台的订单信息
//                             orderTotal: order.orderTotal //订单商品总金额
//                         }
//                     })
//                 }
//             })

//         }
//     })

// })