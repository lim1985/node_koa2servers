const newHunanModel = require("../newHunan/index");
var Base64 = require("js-base64").Base64; //生成base64
class newHunanController {
  static async init_sign (ctx) {
    let data = ctx.request.query;


    let result = await newHunanModel.init_sign(data)
    ctx.body = {
      result
    }
  }
  static async objKeySort (obj) {//排序的函数

    var newkey = Object.keys(obj).sort();

    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newObj = {};//创建一个新的对象，用于存放排好序的键值对
    for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj;//返回排好序的新对象
  }
  static async sendToNewHunan (ctx) {

    let method = ctx.method === 'GET' ? 'GET' : 'POST'
    let sign
    let result = {}
    let data = {}
    let timestamp = new Date().getTime()
    let newhunanDomain = 'api-xhncloud.voc.com.cn';//v2/service/'
    // if (method === 'GET') {
    //   data = ctx.request.query;
    //   sign = await newHunanModel.init_sign(Object.assign(data, { RequestAt: timestamp }))
    //   console.log(timestamp)
    //   //         https://api-xhncloud.voc.com.cn/v2/service/addPost
    //   let url = 'https://api-xhncloud.voc.com.cn/v2/service/getCatelist?CustomerId=' + data.CustomerId + '&' + 'OrgId=' + data.OrgId + '&' + 'Qid=' + data.Qid + '&' + 'RequestAt=' + timestamp + '&' + 'Sign=' + sign
    //   console.log(url)
    //   result = await newHunanModel.HttpsGet(url)
    //   ctx.body = {
    //     result
    //   }

    // }
    // else {
    let action = 'addPost'
    let url = newhunanDomain + action;
    data = ctx.request.body;
    //     RequestAt
    // Sign
    data.RequestAt = timestamp;
    sign = await newHunanModel.init_sign(Object.assign(data, { RequestAt: timestamp }))
    data.sign = sign;
    let base64Content = Base64.encode(data.Content);
    data.Content = base64Content;
    let sortbody = await newHunanController.objKeySort(data);

    const options = {
      hostname: newhunanDomain,
      port: 443,
      path: '/v2/service/' + action,
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Content-Length': Buffer.byteLength(JSON.stringify(sortbody))
      }
    };

    let paramsBody = {
      url: url,
      params: JSON.stringify(data),
      sortbody: JSON.stringify(sortbody),
      options: options
    }
    result = await newHunanModel.HttpsPost(paramsBody);
    ctx.body = {
      paramsBody,
      result
    }
    // }

    // let result = await newHunanModel.init_sign(data, ctx.method)
    // ctx.body = {
    //   result
    // }
  }

}
module.exports = newHunanController;
