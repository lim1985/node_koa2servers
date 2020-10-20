var moment = require("moment");
const FS_ls_report_Model = require("../models/LS_FS");

class FS_ls_report_Controller {
  static async getAllDataGroupbyJDID(ctx) {
    let data = ctx.request.query;
    const result = await FS_ls_report_Model.getAllDataGroupbyJDID(data);
    ctx.body = {
      result
    };
  }
  static async getDataCounts(ctx) {
    let data = ctx.request.query;
    console.log(data);
    const localPersonType = await FS_ls_report_Model.local_personTypeBe15day();
    const FSLS_PersonType = await FS_ls_report_Model.fs_personTypeBe15day();
    // const BE15DayFS_PersonOrLocal=await FS_ls_report_Model.initBE15DayFS_PersonOrLocal(data)
    const result = await FS_ls_report_Model.getDataCounts(data);
    const toDay = await FS_ls_report_Model.getTodayDataCounts(data);
    const yesterday = await FS_ls_report_Model.getyesDayDataCounts(data);
    const be15daylate = await FS_ls_report_Model.getbefore15DataCounts(data);
    ctx.body = {
      result,
      toDay,
      yesterday,
      be15daylate,
      localPersonType,
      FSLS_PersonType
    };
  }

  static async addRecords(ctx) {
    let data = ctx.request.body;
    console.log(data);
    const result = await FS_ls_report_Model.addRecords(data);
    ctx.body = {
      result
    };
  }
  static async auditlog(ctx) {
    let data = ctx.request.body;
    const result = await FS_ls_report_Model.AuditLog(data);
    ctx.body = {
      result
    };
  }

  static async CheckAdminTel(ctx) {
    let data = ctx.request.query;

    const html = await FS_ls_report_Model.getAdmininfo(data);
    console.log(html);
    if (html == null) {
      ctx.body = {
        Isadmin: false,
        code: -1,
        html,
        version: "1.5"
      };
    } else {
      ctx.body = {
        Isadmin: true,
        code: 100,
        html,
        version: "1.5"
      };
    }
    //   ctx.body={
    //     html
    // }
    // const html=await FS_ls_report_Model.getAdmininfo(data);
  }
  static async reportAdd(ctx) {
    let data = ctx.request.body;

    const html = await FS_ls_report_Model.add(data);
    ctx.body = {
      html
    };
  }
  static async reportCheckTel(ctx) {
    let data = ctx.request.query;

    const html = await FS_ls_report_Model.checkTel(data);
    ctx.body = {
      html
    };
  }
  static async getUserReport(ctx) {
    let data = ctx.request.query;
    console.log(data);
    const html = await FS_ls_report_Model.getUserinfo(data);
    if (html == null) {
      ctx.body = {
        code: -1
      };
    } else {
      ctx.body = {
        code: 100,
        html
      };
    }
  }
  static async updateUserReport(ctx) {
    let data = ctx.request.body;

    if (data.EditCount >= 8) {
      ctx.body = {
        code: -1,
        msg: "已经达到修改上限"
      };
      return;
    }
    let i = 0;
    let EditTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    data.EditTime = EditTime;
    i = data.EditCount + 1;
    data.EditCount = i;
    console.log(data);
    const html = await FS_ls_report_Model.update(data);
    ctx.body = {
      html
    };
  }
}
module.exports = FS_ls_report_Controller;
