var crypto = require("crypto");

const Koa = require("koa");
const app = new Koa();
const http = require("http");
const querystring = require("querystring");
app.use(async (ctx, next) => {
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
  ctx.set("Access-Control-Expose-Headers", "myData");

  let smsapi = "api.smsbao.com";
  let sms_u = ctx.query.u;
  let sms_c = ctx.query.c;
  let sms_p = ctx.query.p;
  let sms_m = ctx.query.m;
  let sms_i = ctx.query.i;
  send_sms(smsapi, sms_u, sms_p, sms_c, sms_m);

  function send_sms(smsapi, user, password, content, phone) {
    var data = {
      u: user,
      p: password,
      m: phone,
      c: content
    };
    var content = querystring.stringify(data);
    var sendmsg = ""; //创建空字符串，用来存放收到的数据
    var options = {
      hostname: smsapi,
      path: "/sms?" + content,
      method: "GET"
    };
    //创建请求
    var req = http.request(options, function(res) {
      res.setEncoding("utf-8");
      res.on("data", function(result) {
        statusStr(result);
      });
      res.on("end", function() {});
    });
    req.on("error", function(err) {
      console.error(err);
    });
    req.end();
  }

  function statusStr(result) {
    switch (result) {
      case "0":
        console.log("短信发送成功");
        break;
      case "-1":
        console.log("参数不全");
        break;
      case "-2":
        console.log(
          "服务器空间不支持,请确认支持curl或者fsocket，联系您的空间商解决或者更换空间！"
        );
        break;
      case "30":
        console.log("密码错误");
        break;
      case "40":
        console.log("账户不存在");
        break;
      case "41":
        console.log("余额不足");
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
});
app.listen(3000, () => {
  console.log("启动了3000端口!");
});
