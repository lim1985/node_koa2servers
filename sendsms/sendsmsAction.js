const http = require("http");
const querystring = require("querystring");
const SMSModel = require("../models//SMS_SendRecord");
class sendsmsClass {
  static async GetSendstatus(ctx) {
    const status = ctx.request.query;
    if (status) {
      if (status.s == 1) {
        console.log("发送成功");
        console.log(status);
        SMSModel.UpdateRecord(status).then(res => {
          if (res) {
            console.log("修改成功了！");
          }
        });
      }
      // console.log(status.s)
      // console.log(status)
    }
  }

  static async Send(ctx) {
    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // ctx.set("Access-Control-Allow-Origin", "http://localhost:8080");
    // 设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set(
      "Access-Control-Allow-Headers",
      "x-requested-with, accept, origin, content-type"
    );
    // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
    // Content-Type表示具体请求中的媒体类型信息
    ctx.set("Content-Type", "application/json;charset=utf-8");
    // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
    // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    ctx.set("Access-Control-Allow-Credentials", true);
    // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
    // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
    // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
    ctx.set("Access-Control-Max-Age", 300);
    /*
    CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
        Cache-Control、
        Content-Language、
        Content-Type、
        Expires、
        Last-Modified、
        Pragma。
    */
    // 需要获取其他字段时，使用Access-Control-Expose-Headers，
    // getResponseHeader('myData')可以返回我们所需的值
    //http://api.smsbao.com/api/orange/sms.action
    ctx.set("Access-Control-Expose-Headers", "myData");
    let myquery = ctx.query;

    let smsapi = "api.smsbao.com";
    let sms_u = "limannlee";
    let sms_c = ctx.query.c;
    let sms_p = "1c5264db9ef62279ceff1aad441a1e55";
    let sms_m = ctx.query.m;
    let sms_i = ctx.query.i;
    let param = ctx.query.tokens;
    let UName = ctx.query.U;
    let UID = ctx.query.UID;
    // console.log(smsapi+','+sms_u+','+sms_c+','+sms_p+','+sms_m)
    // let asyncFn = async()=> {
    //     let data = null;
    //     data = await send_sms(smsapi,sms_u,sms_p,content,sms_m);//getData()返回的数据是 {name:'my name is data!'}
    //     console.log(data);//打印出的是my name is data!
    //   }function parsePostData() {
    //  send_sms(smsapi,sms_u,sms_p,sms_c,sms_m).then(result=>{
    //      console.log(result);
    //  })
    ctx.response.body = {
      myquery
    };

    console.log(ctx.query);
    //   let sendstatus=(ctx)=>new Promise((resolve)=>{
    //             setTimeout(() => {
    //               let returns =  sendsmsClass.GetSendstatus(ctx).then(res=>{
    //                 console.log(returns)
    //                 resolve(returns);
    //                 return res
    //               })
    //             }, 1000);
    //     })
    //     let sendsms=(param,smsapi,sms_u,sms_p,sms_m,sms_c)=>new Promise((resolve)=>{
    //         setTimeout(() => {
    //              send_sms_new(param,smsapi,sms_u,sms_p,sms_m,sms_c).then(r=>{
    //                 resolve(r);
    //             })

    //         }, 8000);
    // })
    //     Promise.all([sendsms(param,smsapi,sms_u,sms_p,sms_m,sms_c),sendstatus(ctx)]).then(res=>{
    //         console.log(res)
    //     })
    var sms_send = await send_sms_new(
      param,
      smsapi,
      sms_u,
      sms_p,
      sms_m,
      sms_c
    );
    //   var sms_backstatus=await sendsmsClass.GetSendstatus(ctx);
    //   Promise.all([sms_send,sms_backstatus]).then(res=>{
    //       console.log('Promise All return ')
    //       console.log(res)
    //   })
    let _arr = sms_send.split(/[\s\n]/);
    console.log(_arr);
    ctx.body = {
      // sms_u,
      // sms_c,
      // sms_p,
      // sms_m,
      u: UName,
      uid: UID,
      code: sms_send,
      message: statusStr(_arr[0]),
      i: sms_i
    };
    function send_sms_new(params, smsapi, sms_u, sms_p, sms_m, sms_c) {
      console.log(params);
      if (!params || params == undefined) {
        //判断参数为空时的回传
        let code = "-9";
        return code;
      }
      let parm = JSON.parse(params);
      return new Promise((resolve, reject) => {
        if (params == undefined) {
          let data = "-9";
          resolve(data);
          return false;
        }
        if (parm.username == "" || parm.username == undefined) {
          let data = "-9";
          resolve(data);
          return false;
        } else {
          var data = {
            u: sms_u,
            p: sms_p,
            m: sms_m,
            c: sms_c,
            time: parm.time
          };
          console.log(data);
          var content = querystring.stringify(data);
          var options = {
            hostname: smsapi,
            path: "/api/orange/sms.action?" + content,
            method: "GET"
          };
          var req = http.request(options, function(res) {
            res.setEncoding("utf-8");
            res.on("data", result => {
              console.log(result);
              resolve(result);
              // console.log(statusStr(result));
            });
            res.on("end", function() {});
          });
          req.on("error", function(reject) {
            console.error(reject);
          });

          req.end();
        }
      });
    }

    function statusStr(result) {
      switch (result) {
        case "-9":
          console.log("接口登陆认证失败");
          return "接口登陆认证失败，请登录";
          break;
        case "0":
          console.log("短信提交成功");
          return "短信提交成功";
          break;
        case "-1":
          console.log("参数不全");
          return "参数不全";
          break;
        case "-2":
          console.log(
            "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！"
          );
          break;
        case "30":
          console.log("密码错误");
          return "密码错误";

          break;
        case "40":
          console.log("账户不存在");
          break;
        case "41":
          console.log("余额不足");
          return "短信余额不足";

          break;
        case "42":
          console.log("账户已过期");
          break;
        case "43":
          console.log("IP地址限制");
          break;
        case "50":
          console.log("内容含有敏感字");
          break;
      }
    }
  }
}

module.exports = sendsmsClass;
