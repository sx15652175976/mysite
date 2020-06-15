var mongoose = require('mongoose') //导入mongoose
var userSchema = new mongoose.Schema({ //实例mongoos中的Schema方法(规范)
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [{
        "productImage": String,
        "salePrice": String,
        "productName": String,
        "productId": String,
        "productNum": Number,
        "checked": String
    }],
    "addressList": [{
        "addressId": String,
        "userName": String,
        "streetName": String,
        "postCode": String,
        "tel": String,
        "isDefault": Boolean
    }]
})

module.exports = mongoose.model('user', userSchema);