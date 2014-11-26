var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var subscribeSchema = new Schema({
mail: String,              //用户邮箱
city: String,
local: Array,               //关键词数组
open: Boolean,             //是否退订
room_num: String,           //房间数量数组（一居）
room_size: String,          //房间大小（主卧，整租，次卧）
rent_way: String,           //租赁方式（求租，合租）
date: Date               //第一次订阅的时间
});

module.exports = mongodb.mongoose.model("subscribe", subscribeSchema);
