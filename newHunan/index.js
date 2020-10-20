const db = require("../config/db");
const gov = db.gov;
// const http = require("http");
const https = require('https');
const querystring = require("querystring");
var Base64 = require("js-base64").Base64; //生成base64
const crypto = require("crypto"); //生成MD5
// const DepSmsAccouts = gov.import("../schema/LIM_CmccDepAccounts.js");
// const DEP = gov.import("../schema/LIM_Department.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const key = 'XfhblktU2sJVPXQT7au8JlD1zgFObA2X';
// DEP.hasOne(DepSMSCount,{

// })

// SysUser.hasOne(MonitorSetting,{foreignKey: 'uId',sourceKey: 'id'});
// MonitorSetting.belongsTo(SysUser, {foreignKey: 'uId',targetKey: 'id'});

// DEP.hasOne(DepSMSCount, { foreignKey: 'DepID' })
// DepSMSCount.belongsTo(DEP, {foreignKey: 'DepID',targetKey: 'DepartmentId'});

// DEP.belongsTo(DepSmsAccouts, {
//   foreignKey: "DepartmentId",
//   targetKey: "DepID",
//   as: "DepSmsAccouts"
// });

class NewHunanClass {
  static async objTostring (obj) {
    let str = '';
    for (let key in obj) {
      // console.log(key + '---' + param[key])
      str = str + obj[key];
    }

    return str;
  }
  static async HttpsGet (url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let err;
        const { statusCode } = res;
        let rawData = "";

        if (!statusCode === 200)
          err = new Error("服务器响应失败");
        if (!/application\/json/.test(res.headers["content-type"]))
          err = new Error("数据格式错误，需要json格式");
        if (err) {
          console.log(err);
          //释放内存
          res.resume();
          return;
        }

        // chunk是16进制BUFFER数据，需要转成字符打印
        res.on("data", (chunk) => {
          rawData += chunk;

        });

        //监听请求结束
        res.on("end", () => {
          try {
            console.log(`结果`)
            console.log(unescape(rawData.replace(/\\u/g, '%u')));
            resolve(JSON.parse(unescape(rawData.replace(/\\u/g, '%u'))))
            // return JSON.parse(unescape(rawData.replace(/\\u/g, '%u')));
          } catch (e) {
            console.log(e);
          }
        });
      }).on("error", (error) => {
        console.log(error);
      });
    })
  }
  static async HttpsPost (
    params //移动发短信方法
  ) {
    return new Promise((resolve, reject) => {
      if (params == undefined) {
        let data = "-9";
        resolve(data);
        return false;
      } else {
        // let smsapi = "112.35.1.155";
        // const content = JSON.stringify(params);

        var options = params.options
        var req = https.request(options, function (res) {
          res.setEncoding("utf-8");
          res.on("data", result => {
            console.log(result)
            resolve(result);
            // console.log(statusStr(result));
          });
          res.on("end", function () { });
        });
        req.on("error", function (reject) {
          console.error(reject);
        });
        req.write(params.params);
        req.end();
      }
    });
  }

  static async init_sign (obj) {

    let flag = 'hnrb';
    let result = await NewHunanClass.objTostring(obj)
    // let timestamp = Math.round(new Date() / 1000)
    let md5 = crypto.createHash("md5");
    let ss = flag + result + key + obj.RequestAt;
    console.log(ss)
    let sign = md5
      .update(ss, "utf-8")
      .digest("hex")
      .toString();
    console.log(sign)
    return sign;
  }
  /**
   *
   * @param {*} s
   * @param {*} DepID
   */
  static async selectDepAccounts (DepID) {
    return new Promise((resolve, reject) => {
      try {
        DEP.findAndCountAll({
          attributes: [
            "DepartmentId",
            Sequelize.col("DepSmsAccouts.ApID"),
            Sequelize.col("DepSmsAccouts.Password"),
            Sequelize.col("DepSmsAccouts.Sign"),
            Sequelize.col("DepSmsAccouts.AddSerial"),
            Sequelize.col("DepSmsAccouts.EcName"),
            Sequelize.col("DepSmsAccouts.TemplateId"),
            Sequelize.col("DepSmsAccouts.Params")
          ],
          where: {
            DepartmentId: DepID
          },
          include: [
            {
              model: DepSmsAccouts,
              as: "DepSmsAccouts",
              attributes: [],
              required: false
            }
          ],
          raw: true
        }).then(res => {
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static ToUnicode (str) {
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
  static ToGB2312 (str) {
    return unescape(str.replace(/\\u/gi, "%u"));
  }

  static async checkCaptchatoken (ctx) {
    let md5 = crypto.createHash("md5");

    const data = ctx.request.query;
    let _md5 = Smssecret + data.captcha + data.mobile;

    let bb_token = md5
      .update(_md5, "utf-8")
      .digest("hex")
      .toString();
    console.log(data);
    console.log(bb_token);
    if (bb_token == data.cc_token) {
      let result = {
        code: 1000,
        msg: "success"
      };
      ctx.body = {
        result
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "error"
      };
    }
  }
  static async checkCaptcha (ctx) {
    let ck = ctx.cookies.get("vv");
    console.log(`验证ck`);
    console.log(ck);
    console.log(ctx.cookies);
    const data = ctx.request.query;
    console.log(data);
    if (data.mobile && data.captcha == ck) {
      ctx.cookies.set("vv", "");
      let result = {
        code: 1000,
        msg: "success"
      };
      ctx.body = {
        result
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "error"
      };
    }
  }

  static async GetVerificatCodeAdSmssecret (ctx) {
    const data = ctx.request.query;
    console.log(data);
    let md5 = crypto.createHash("md5");
    let md5token = crypto.createHash("md5");
    let b = JSON.stringify(data) == "{}";

    if (b || data.length == 0) {
      ctx.body = {
        code: -1,
        message: "参数错误"
      };
    } else if (JSON.stringify(data).indexOf("mobile") == -1) {
      console.log("到这里了，么有传 mobile");
      ctx.body = {
        code: -1,
        message: "参数错误"
      };
    } else {
      let _data = data;

      let Randomnum = Math.random()
        .toString()
        .slice(-4);
      //生成 随机验证码

      //  await ctx.cookies.set("vv",Randomnum,{maxAge:60*4*1000, httpOnly:true});
      // _data.EcName='邵阳市大祥区融媒体中心'
      // _data.ApID='dxqrmz'
      // _data.Password='123456'
      // _data.Sign='YspJXukj3'
      _data.EcName = "邵阳市大祥区融媒体中心";
      _data.ApID = "dxqrmz";
      _data.Password = "123456";
      _data.Sign = "YspJXukj3";
      // _data.EcName = "邵阳市大祥区政协办工会委员会";
      // _data.ApID = "dxqrmt";
      // _data.Password = "123456";
      // _data.Sign = "V5J06zO73";
      _data.AddSerial = "";
      _data.TemplateId = "";
      _data.Params = "";
      _data.content = `您好，验证码为：${Randomnum}，${
        !_data.contents ? "大祥区融媒体中心" : _data.contents
        }。`;

      if (_data.mobile) {
        //soucers=1 是移动的普通发送 2 是模板发送
        let md5_token = Smssecret + Randomnum + _data.mobile;
        let cc_token = md5token
          .update(md5_token, "utf-8")
          .digest("hex")
          .toString();
        console.log(cc_token);


        let p =
          _data.EcName +
          _data.ApID +
          _data.Password +
          _data.mobile +
          _data.content +
          _data.Sign +
          _data.AddSerial;
        //let p=data.ecName+data.apId+"@123456aa//"+data.mobiles+data.content+singnew+''
        let mac = md5
          .update(p, "utf-8")
          .digest("hex")
          .toString();
        // let json=JSON.stringify(Param).toString();
        let newParam = {
          content: _data.content,
          sign: _data.Sign,
          apId: _data.ApID,
          mac: mac,
          ecName: _data.EcName,
          addSerial: _data.AddSerial,
          secretKey: _data.Password,
          mobiles: _data.mobile
        };
        let results = ChinaCMCCSms.ToUnicode(JSON.stringify(newParam));
        console.log(results);
        // let unicode=GB2312UnicodeConverter.convert_int_to_utf8(results);
        // console.log(unicode);
        let _params = Base64.encode(results);
        let result2 = Base64.decode(_params);
        let obj = JSON.parse(result2);
        let res = await ChinaCMCCSms.SendByHttp(_params);
        let _result = JSON.parse(res); //移动返回的结果
        _result.msgGroup = ""; //去除短信组ID
        _result.cc_token = cc_token;

        ctx.body = {
          _result
        };
      }
    }
  }

  static async GetVerificatCode (ctx) {
    const data = ctx.request.query;
    console.log(data);
    let md5 = crypto.createHash("md5");
    let b = JSON.stringify(data) == "{}";

    if (b || data.length == 0) {
      ctx.body = {
        code: -1,
        message: "参数错误"
      };
    } else if (JSON.stringify(data).indexOf("mobile") == -1) {
      console.log("到这里了，么有传 mobile");
      ctx.body = {
        code: -1,
        message: "参数错误"
      };
    } else {
      let _data = data;

      let Randomnum = Math.random()
        .toString()
        .slice(-4);
      //生成 随机验证码
      await ctx.cookies.set("vv", Randomnum, {
        maxAge: 60 * 4 * 1000,
        httpOnly: true
      });

      //  _data.EcName='邵阳市大祥区融媒体中心'
      //  _data.ApID='dxqrmz'
      //  _data.Password='123456'
      //  _data.Sign='YspJXukj3'
      //  _data.AddSerial=''
      //  _data.TemplateId=''
      //  _data.Params=''
      //  _data.EcName='邵阳市大祥区政协办工会委员会'
      //  _data.ApID='dxqrmt'
      //  _data.Password='123456'
      //  _data.Sign='V5J06zO73'

      _data.EcName = "邵阳市大祥区融媒体中心";
      _data.ApID = "dxqrmz";
      _data.Password = "123456";
      _data.Sign = "YspJXukj3";
      _data.AddSerial = "";
      _data.TemplateId = "";
      _data.Params = "";
      _data.content = `您好，验证码为：${Randomnum}，欢迎你回到大邵阳111，请输入验证码提交申请。`;

      if (_data.mobile) {
        //soucers=1 是移动的普通发送 2 是模板发送
        console.log(`9999`);
        let p =
          _data.EcName +
          _data.ApID +
          _data.Password +
          _data.mobile +
          _data.content +
          _data.Sign +
          _data.AddSerial;
        //let p=data.ecName+data.apId+"@123456aa//"+data.mobiles+data.content+singnew+''
        let mac = md5
          .update(p, "utf-8")
          .digest("hex")
          .toString();
        // let json=JSON.stringify(Param).toString();

        let newParam = {
          content: _data.content,
          sign: _data.Sign,
          apId: _data.ApID,
          mac: mac,
          ecName: _data.EcName,
          addSerial: _data.AddSerial,
          secretKey: _data.Password,
          mobiles: _data.mobile
        };
        let results = ChinaCMCCSms.ToUnicode(JSON.stringify(newParam));
        console.log(results);
        // let unicode=GB2312UnicodeConverter.convert_int_to_utf8(results);
        // console.log(unicode);
        let _params = Base64.encode(results);

        let result2 = Base64.decode(_params);
        console.log(result2);
        let obj = JSON.parse(result2);
        console.log(obj.mobiles);
        console.log(obj.mobiles.split(","));
        console.log(typeof obj.mobiles.split(","));
        let res = await ChinaCMCCSms.SendByHttp(_params);
        let _result = JSON.parse(res); //移动返回的结果
        _result.msgGroup = ""; //去除短信组ID

        let ck = ctx.cookies.get("vv");
        console.log(`验证ck`);
        console.log(ck);
        ctx.body = {
          _result
        };
      }
    }
  }
  static async Verification (data) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set(
      "Access-Control-Allow-Headers",
      "x-requested-with, accept, origin, content-type"
    );
    ctx.set("Content-Type", "application/json;charset=utf-8");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 300);
    ctx.set("Access-Control-Expose-Headers", "myData");

    let md5 = crypto.createHash("md5");

    console.log("post 提交的");
    console.log(data);
  }
  static async newinitsmsbody (ctx, next) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set(
      "Access-Control-Allow-Headers",
      "x-requested-with, accept, origin, content-type"
    );
    ctx.set("Content-Type", "application/json;charset=utf-8");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 300);
    ctx.set("Access-Control-Expose-Headers", "myData");
    const method = ctx.request.method;
    let md5 = crypto.createHash("md5");
    if (method === "POST") {
      console.log("post 提交的");
      const data = ctx.request.body;
      let _result = await ChinaCMCCSms.selectDepAccounts(data.DepID);
      let _data = _result.rows[0];
      //ApID dxqrmt	Password 123456	Sign V5J06zO73 AddSerial	NULL EcName	邵阳市大祥区政协办工会委员会 TemplateId	NULL Params	NULL
      if (!_data.EcName) {
        // 如果该单位没有配置短信接口的时候的
        _data.EcName = "邵阳市大祥区融媒体中心";
        _data.ApID = "dxqrmz";
        _data.Password = "123456";
        _data.Sign = "YspJXukj3";
        _data.AddSerial = "";
        _data.TemplateId = "";
        _data.Params = "";
      }
      console.log(_result);
      console.log(data);
      console.log(`-----------------+++++++++++++++++________________`);
      console.log(_data);
      if (data.soucers == 1) {
        //soucers=1 是移动的普通发送 2 是模板发送
        //将ecName、apId、secretKey、mobiles、content、sign、addSerial按序拼接（无间隔符）成字符串，例：
        let p =
          _data.EcName +
          _data.ApID +
          _data.Password +
          data.mobiles +
          data.content +
          _data.Sign +
          _data.AddSerial;
        //let p=data.ecName+data.apId+"@123456aa//"+data.mobiles+data.content+singnew+''
        let mac = md5
          .update(p, "utf-8")
          .digest("hex")
          .toString();
        // let json=JSON.stringify(Param).toString();
        //G4KxLhOwX
        let newParam = {
          content: data.content,
          sign: _data.Sign,
          apId: _data.ApID,
          mac: mac,
          ecName: _data.EcName,
          addSerial: _data.AddSerial,
          secretKey: _data.Password,
          mobiles: data.mobiles
        };
        console.log(newParam);
        let results = JSON.stringify(newParam);
        //  let results=JSON.stringify(newParam);
        console.log(results);
        let _params = Base64.encode(results);
        console.log(`base64`);
        console.log(_params);
        let res = await ChinaCMCCSms.SendByHttp(_params);

        ctx.body = {
          res,
          newParam,
          _params
        };
      }
    }
  }
  static async InitBody (ctx, next) {
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

    const method = ctx.request.method;
    let md5 = crypto.createHash("md5");
    if (method === "POST") {
      console.log("post 提交的");
      const data = ctx.request.body;

      let _result = await ChinaCMCCSms.selectDepAccounts(data.DepID);
      let _data = _result.rows[0];
      //ApID dxqrmt	Password 123456	Sign V5J06zO73 AddSerial	NULL EcName	邵阳市大祥区政协办工会委员会 TemplateId	NULL Params	NULL
      if (!_data.EcName) {
        _data.EcName = "邵阳市大祥区政协办工会委员会";
        _data.ApID = "dxqrmt";
        _data.Password = "123456";
        _data.Sign = "V5J06zO73";
        _data.AddSerial = "";
        _data.TemplateId = "";
        _data.Params = "";
      }
      console.log(_data);
      console.log(data);
      if (data.soucers == 1) {
        //soucers=1 是移动的普通发送 2 是模板发送
        let p =
          _data.EcName +
          _data.ApID +
          _data.Password +
          data.mobiles +
          data.content +
          _data.Sign +
          _data.AddSerial;
        //let p=data.ecName+data.apId+"@123456aa//"+data.mobiles+data.content+singnew+''
        let mac = md5
          .update(p, "utf-8")
          .digest("hex")
          .toString();
        // let json=JSON.stringify(Param).toString();

        let newParam = {
          content: data.content,
          sign: _data.Sign,
          apId: _data.ApID,
          mac: mac,
          ecName: _data.EcName,
          addSerial: _data.AddSerial,
          secretKey: _data.Password,
          mobiles: data.mobiles
        };
        let results = ChinaCMCCSms.ToUnicode(JSON.stringify(newParam));

        // let unicode=GB2312UnicodeConverter.convert_int_to_utf8(results);
        // console.log(unicode);
        let _params = Base64.encode(results);
        console.log(`11111111111111`);
        console.log(_params);

        // let pps='eyJjb250ZW50IjogIlx1NzlmYlx1NTJhOFx1NjUzOVx1NTNkOFx1NzUxZlx1NmQzYlx1MzAwMiIsICJzaWduIjogIkRXSXRBTGUzQSIsICJhcElkIjogImRlbW8wIiwgIm1hYyI6ICI3OTk3ZGRiMDc5ZGIyMTU1YjUxN2IyMWIyYTgxMjM3MCIsICJlY05hbWUiOiAiXHU2NTNmXHU0ZjAxXHU1MjA2XHU1MTZjXHU1M2Y4XHU2ZDRiXHU4YmQ1IiwgImFkZFNlcmlhbCI6ICIiLCAic2VjcmV0S2V5IjogIjEyM3F3ZSIsICJtb2JpbGVzIjogIjEzODAwMTM4MDAwIn0='
        // let result= Base64.decode(pps)
        // console.log(result);
        let result2 = Base64.decode(_params);
        console.log(result2);
        let obj = JSON.parse(result2);
        console.log(obj.mobiles);
        console.log(obj.mobiles.split(","));
        console.log(typeof obj.mobiles.split(","));
        let res = await ChinaCMCCSms.SendByHttp(_params);
        console.log("输出");
        console.log(res);
        ctx.body = {
          res
        };
      }
    }
  }

  static async SendByHttp (
    params //移动发短信方法
  ) {
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
        var req = http.request(options, function (res) {
          res.setEncoding("utf-8");
          res.on("data", result => {
            resolve(result);
            // console.log(statusStr(result));
          });
          res.on("end", function () { });
        });
        req.on("error", function (reject) {
          console.error(reject);
        });
        req.write(content);
        req.end();
      }
    });
  }
}
module.exports = NewHunanClass;
