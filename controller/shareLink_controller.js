const ShareLinkModel = require("../shareLink/index");

class ShareLinkController {
  static async get(ctx) {
    const data = ctx.request.query;
    const res = await ShareLinkModel.get(data);
    console.log(res);
    ctx.body = {
      res
    };
  }
  static async countAllshareLink(ctx) {
    let keywords = ["原创", "转载", "媒体聚焦", "大祥发布"];
    let objresult = {};
    let datetime = ctx.request.query;
    let count = 0;
    let MtJJ_Count = 0;
    let DXFB_Count = 0;
    for (let i = 0; i < keywords.length; i++) {
      let result = await ShareLinkModel.countAllshareLink(
        Object.assign({ keyword: keywords[i] }, datetime)
      );
      console.log(result.count);
      if (i == 2) {
        MtJJ_Count = result.count;
      } else if (i == 3) {
        DXFB_Count = result.count;
      } else {
        count = count + result.count;
      }
      objresult[keywords[i]] = result;
      objresult.countPublish = count;
      objresult.AllCountPublish = count * 4 + MtJJ_Count + DXFB_Count;
      objresult.MtJJ_Count = MtJJ_Count;
      objresult.DXFB_Count = DXFB_Count;
    }

    ctx.body = {
      objresult
    };
  }
  static async add(ctx) {
    const data = ctx.request.query;
    console.log(data);
    if (JSON.stringify(data) == "{}") {
      ctx.body = {
        code: -1,
        msg: "参数错误"
      };
    } else {
      //    const isExist =await ShareLinkModel.get(data)
      //    console.log(isExist)
      const res = await ShareLinkModel.add(data);
      ctx.body = {
        res
      };
    }
    // if(!data)
    // {
    //     ctx.body={
    //         code:-1,
    //         msg:'参数错误'
    //     }
    // }
    // const res =await ShareLinkController.add(data)
    // console.log(res)
  }
}
module.exports = ShareLinkController;
