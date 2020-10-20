const http = require("http");
const querystring = require("querystring");
var Base64 = require("js-base64").Base64; //生成base64
const crypto = require("crypto"); //生成MD5

class ChinaCMCCSms {
  static ToUnicode(str) {
    var txt = escape(str).replace(/%u/gi, "\\u");
    return txt
      .replace(/%7b/gi, "{")
      .replace(/%7d/gi, "}")
      .replace(/%3a/gi, ":")
      .replace(/%2c/gi, ",")
      .replace(/%27/gi, "'")
      .replace(/%22/gi, '"')
      .replace(/%5b/gi, "[")
      .replace(/%5d/gi, "]")
      .replace(/%3D/gi, "=")
      .replace(/%20/gi, " ")
      .replace(/%3E/gi, ">")
      .replace(/%3C/gi, "<")
      .replace(/%3F/gi, "?");
  }
  static ToGB2312(str) {
    return unescape(str.replace(/\\u/gi, "%u"));
  }
  static async InitBody(ctx, next) {
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
    // 需要获取其他字段时，使用Access-Control-Expose-Headers，
    // getResponseHeader('myData')可以返回我们所需的值
    ctx.set("Access-Control-Expose-Headers", "myData");
    let mysign = "4Ufjw0y6L";
    const method = ctx.request.method;
    let md5 = crypto.createHash("md5");
    if (method === "POST") {
      console.log("post 提交的");
      const data = ctx.request.body;

      if (data.soucers == 1) {
        //soucers=1 是移动的普通发送 2 是模板发送
        let Param = {
          ecName: data.ecName,
          apId: data.apId,
          secretKey: "52979899",
          mobiles: data.mobiles,
          content: data.content,
          sign: mysign,
          addSerial: ""
        };

        let p =
          data.ecName +
          data.apId +
          "52979899" +
          data.mobiles +
          data.content +
          mysign +
          "";
        Param.mac = md5
          .update(p, "utf-8")
          .digest("hex")
          .toString();
        // let json=JSON.stringify(Param).toString();
        console.log(Param);
        console.log(typeof Param);
        let newParam = {
          content: Param.content,
          sign: Param.sign,
          apId: Param.apId,
          mac: Param.mac,
          ecName: Param.ecName,
          addSerial: Param.addSerial,
          secretKey: Param.secretKey,
          mobiles: Param.mobiles
        };
        let results = ChinaCMCCSms.ToUnicode(JSON.stringify(newParam));
        console.log(results);
        // let unicode=GB2312UnicodeConverter.convert_int_to_utf8(results);
        // console.log(unicode);
        let _params = Base64.encode(results);
        console.log(_params);

        // let pps='eyJjb250ZW50IjogIlx1NzlmYlx1NTJhOFx1NjUzOVx1NTNkOFx1NzUxZlx1NmQzYlx1MzAwMiIsICJzaWduIjogIkRXSXRBTGUzQSIsICJhcElkIjogImRlbW8wIiwgIm1hYyI6ICI3OTk3ZGRiMDc5ZGIyMTU1YjUxN2IyMWIyYTgxMjM3MCIsICJlY05hbWUiOiAiXHU2NTNmXHU0ZjAxXHU1MjA2XHU1MTZjXHU1M2Y4XHU2ZDRiXHU4YmQ1IiwgImFkZFNlcmlhbCI6ICIiLCAic2VjcmV0S2V5IjogIjEyM3F3ZSIsICJtb2JpbGVzIjogIjEzODAwMTM4MDAwIn0='
        // let result= Base64.decode(pps)
        // console.log(result);
        let result2 = Base64.decode(_params);
        console.log(result2);
        let obj = JSON.parse(result2);
        console.log(obj);
        if (obj.secretKey == "52979899") {
          ChinaCMCCSms.SendByHttp(_params);
        } else {
          console.log("密码不正确");
        }
      }
    }
  }

  static async SendByHttp(params) {
    return new Promise((resolve, reject) => {
      if (params == undefined) {
        let data = "-9";
        resolve(data);
        return false;
      } else {
        let smsapi = "112.35.1.155";
        const content = JSON.stringify(params);
        var options = {
          host: smsapi,
          port: 1992,
          path: "/sms/norsubmit",
          method: "POST",
          headers: {
            "Content-type": "application/json"
          }
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
        req.write(content);
        req.end();
      }
    });
  }
}
module.exports = ChinaCMCCSms;
