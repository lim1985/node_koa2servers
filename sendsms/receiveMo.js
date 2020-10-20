const db = require("../config/db");
const gov = db.gov;
const http = require("http");
const querystring = require("querystring");
const SMSModel = require("../models/SMS_SendRecord");
const Users = gov.import("../schema/LIM_UsersPhone.js");
const Dep = gov.import("../schema/LIM_Department.js");
Users.belongsTo(Dep, {
  foreignKey: "Department_ID",
  sourceKey: "DepartmentId",
  as: "M_Dep"
}); //MeetingSubject和attachs 表 1对1

const Sequelize = require("sequelize");
// const Area = gov.import('../schema/LIM_Area')
const Op = Sequelize.Op;

class receiveMo {
  static async CMCCSendStatus(ctx//中国移动接收发送成功信息
  ) {
    let status = ctx.request.body;
    if (status.errorCode == "DELIVRD" && status.reportStatus == "CM:0000") {
      let data = {
        s: "1",
        t: status.msgGroup
      };
      SMSModel.UpdateRecord(data).then(res => {
        if (res) {
          console.log("修改成功了！");
        }
      });
      // console.log('发送成功了')
      // status.msgGroup
      // status.reportStatus=='CM:0000'
    }
    ctx.body = status;
    console.log("111-111");
    console.log(status);
  }

  
  static async Dxqrmzfbmo(
    ctx //YspJXukj3 大祥区人民政府办
  ) {
    let mo = ctx.request.body;
    let result = await Users.findOne({
      include: [
        {
          model: Dep,
          as: "M_Dep"
        }
      ],
      where: {
        [Op.or]: [{ cellphone: mo.mobile }, { H_cellphone: mo.mobile }]
      }
    });
    console.log(result);
    let data = {
      UJOB: result.UJOB,
      moDepID: result.M_Dep.DepartmentId,
      moDepName: result.M_Dep.DepartmentName,
      UserName: result.UserName,
      moible: mo.mobile,
      sendtime: mo.sendTime,
      moContent: mo.smsContent,
      DepID: 112
    };
    console.log(data);

    SMSModel.SaveMo(data).then(res => {
      ctx.body = {
        res
      };
    });
  }
  static async Dxqqwbmo(
    ctx //YspJXukj3 大祥区人民政府办
  ) {
    let mo = ctx.request.body;
    let result = await Users.findOne({
      include: [
        {
          model: Dep,
          as: "M_Dep"
        }
      ],
      where: {
        [Op.or]: [{ cellphone: mo.mobile }, { H_cellphone: mo.mobile }]
      }
    });
    console.log(result);
    let data = {
      UJOB: result.UJOB,
      moDepID: result.M_Dep.DepartmentId,
      moDepName: result.M_Dep.DepartmentName,
      UserName: result.UserName,
      moible: mo.mobile,
      sendtime: mo.sendTime,
      moContent: mo.smsContent,
      DepID: 84
    };
    console.log(data);

    SMSModel.SaveMo(data).then(res => {
      ctx.body = {
        res
      };
    });
  }
  static async CMCCMO(ctx) {
    let mo = ctx.request.body;
    let data = {
      moible: mo.mobile,
      sendtime: mo.sendTime,
      moContent: mo.smsContent
      //LIM_SMSMorecord
    };
    SMSModel.SaveMo(data).then(res => {
      ctx.body = {
        res
      };
    });

    console.log("222-222");
  }
  //接收MO接口
  static async mo(ctx) {
    let mo = ctx.request.query;
    console.log(mo);
    var url = window.location.href;
    console.log(url);
    let start = false;
    if (mo) {
      start = true;
      if (start) {
        console.log(mo);
        start = false;
        console.log("接收到了短信");
        console.log(start);
      }
    }
    ctx.body = {
      c: mo.c,
      m: mo.m,
      le: "接受短信页面API"
    };
  }
  //发送接口
  static async Send(ctx, next) {
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
    let myquery = ctx.query;
    let smsapi = "api.smsbao.com";
    let sms_u = "limannlee";
    let sms_c = ctx.query.c;
    let sms_p = "d8a341b329a63c4f0789511ae8a81fec";
    let sms_m = ctx.query.m;
    let sms_i = ctx.query.i;
  }
}

module.exports = receiveMo;
