var moment = require("moment");
const kakInfo_Model = require("../models/kakInfo");

class FkakoInfo_Controller {
  static async getAllKakoandCounts(ctx) {
    let data = ctx.request.query;
    const html = await kakInfo_Model.getKakoAllInfo(data);
    ctx.body = {
      html
    };
  }

  static async kakoInfoselect(ctx) {
    let data = ctx.request.body;

    console.log(data);
    let _data = {
      DepID: data.JDSQ.jdCode,
      SQID: data.JDSQ.sqCode
    };

    const html = await kakInfo_Model.selectkako(_data);
    ctx.body = {
      html
    };
  }

  static async kakoInfoAdd(ctx) {
    let data = ctx.request.body;
    console.log(data);
    let _data = {
      kk_name: data.addkkname,
      DepID: data.JDSQ.jdCode,
      createUserId: data.JDSQ.AdminId,
      SQID: data.JDSQ.sqCode,
      createTimes: moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    };
    const html = await kakInfo_Model.addkako(_data);
    // add_GroupRefere
    // add_CustomGroup
    ctx.body = {
      html
    };

    // DepID
    // kk_name
    // createUserId
    // createTimes
    // SQID
    // let createTimes=  moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    // const html=await kakInfo_Model.add(data);
    // ctx.body={
    //     html
    // }
  }
  // static async reportCheckTel(ctx)
  // {
  //     let data=ctx.request.query;

  //     const html=await FS_ls_report_Model.checkTel(data);
  //     ctx.body={
  //         html
  //     }
  // }
  // static async getUserReport(ctx)
  // {
  //     let data=ctx.request.query;

  //     const html=await FS_ls_report_Model.getUserinfo(data);
  //     if(html==null)
  //     {
  //         ctx.body={
  //             code:-1

  //         }
  //     }
  //     else
  //     {
  //         ctx.body={
  //             code:100,
  //             html

  //         }

  //     }
  // }
  // static async updateUserReport(ctx)
  // {
  //     let data=ctx.request.body;

  //        if(data.EditCount>=3)
  //        {
  //            ctx.body={
  //                code:-1,
  //                msg:'已经达到修改上限'

  //            }
  //            return
  //        }
  //        let i=0
  //         let EditTime=moment().format('YYYY-MM-DD HH:mm:ss')
  //         data.EditTime=EditTime
  //         i=data.EditCount+1
  //         data.EditCount=i
  //         console.log(data)
  //         const html=await FS_ls_report_Model.update(data);
  //         ctx.body={
  //             html
  //         }
  // }
}
module.exports = FkakoInfo_Controller;
