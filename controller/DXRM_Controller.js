// const cheerioModel = require('../cheerio/index')
const dxrmModel = require("../models/DXRM");
class dxrmController {
  static async seletDepCount(ctx) {
    const data = ctx.request.query;
    let depCount = await dxrmModel.GetDeplistGroupByDepID(data);
    let count = depCount.count;
    ctx.body = {
      count
    };
  }
  static async GetAllDepLists(ctx) {
    const data = ctx.request.query;
    let Deplists = await dxrmModel.GetAllDeplists();
    console.log(Deplists);
    if (Deplists) {
      ctx.body = {
        Deplists
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "查不到该单位"
      };
    }
  }
  static async GetDepListLikeName(ctx) {
    const data = ctx.request.query;
    let Deplist = await dxrmModel.GetDepListLikeName(data);
    console.log(Deplist);
    if (Deplist) {
      ctx.body = {
        Deplist
      };
    } else {
      ctx.body = {
        code: -1,
        msg: "查不到该单位"
      };
    }
  }

  static async finduserByTel(ctx) {
    let data = ctx.request.query;
    let userinfo = await dxrmModel.finduserByTel(data);
    if (!userinfo) {
      ctx.body = {
        code: -1,
        msg: "没有找到该用户"
      };
    } else {
      ctx.body = {
        code: 1,
        msg: "success",
        userinfo
      };
    }
  }
  static async getUserInformation(ctx) {
    let data = ctx.request.query;
    let userinfo = await dxrmModel.GetUserInformation(data);
    if (userinfo) {
      ctx.body = {
        isok: false,
        userinfo,
        msg: "已经提交过记录"
      };
    } else {
      ctx.body = {
        isok: true,

        msg: "可以提交"
      };
    }
  }

  static async createUser(ctx) {
    let data = ctx.request.body;
    console.log(data);
    let isok = await dxrmModel.findUser(data);
    if (!isok) {
      const html = await dxrmModel.createUser(data);
      console.log(html);
      ctx.body = {
        isok: true,
        html
      };
    } else {
      ctx.body = {
        isok: false,
        msg: "已经提交，请不要重复提交"
      };
    }
  }

  // static async getrednetLive(ctx)
  // {
  //     let data=ctx.request.query
  //     const html=await cheerioModel.GetrednetLive(data)
  //     ctx.body={
  //         html
  //     }
  // }
}
module.exports = dxrmController;
