const A_C_v = require("../models/A_C_V");

class A_C_vController {
  static async registers(ctx) {
    let data = ctx.request.body;
    console.log(data);
    let ck = ctx.cookies.get("vv");
    console.log(ck);
    ctx.body = {
      data,
      ck
    };
  }
  static async getBYuuid(ctx) {
    let data = ctx.request.query;

    const html = await A_C_v.GetbyUUid(data);
    ctx.body = {
      html
    };
  }
  static async getall(ctx) {
    let data = ctx.request.query;

    const html = await A_C_v.getall(data);
    ctx.body = {
      html
    };
  }
  static async GetVistorbyTel(ctx) {
    let data = ctx.request.query;
    const html = await A_C_v.GetVistorbyTel(data);
    ctx.body = {
      html
    };
  }
}
module.exports = A_C_vController;
