var mongoose = require("mongoose") //引入mongoose
var Schema = mongoose.Schema //调用模型
var ProductSchema = new Schema({ //设置模型
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
    "productNum": Number,
    "checked": String
})
module.exports = mongoose.model("db_demo", ProductSchema) //模型对象module.exports导出