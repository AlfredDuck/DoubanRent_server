var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var ip_citySchema = new Schema({
calltime: Array,             //记录单独ip每次访问的时间
ip: String,                  //ip地址
city: String                 //访问某个城市页面的ip数量
});

module.exports = mongodb.mongoose.model("ip_city", ip_citySchema);
