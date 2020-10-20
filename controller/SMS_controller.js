const SMSModel = require("../models/SMS_SendRecord");
// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class SMSController {
  // GetSmsRecord 获取短信发送记录//根据部门ID
  //GetSmsMo 获取短信回复记录//根据部门ID
  static async getsmsmo(ctx) {
    let data = ctx.request.query;
    let result;
    if (data.DepID) {
      result = await SMSModel.GetSmsMo({ DepID: parseInt(data.DepID) });
    } else {
      result = {
        code: -1
      };
    }
    ctx.body = {
      result
    };
  }

  static async getsmsRecord(ctx) {
    let data = ctx.request.query;
    let result;
    if (data.DepID) {
      result = await SMSModel.GetSmsRecord({ DepID: parseInt(data.DepID) });
    } else {
      result = {
        code: -1
      };
    }
    ctx.body = {
      result
    };
  }

  /*
*添加历史修改记录，post传入ctx 对象

*/
  static async SelectSucceedCount(ctx) {
    let data = ctx.request.query;
    if (data) {
      let res = await SMSModel.succeedCount(data);
      if (res) {
        ctx.body = {
          result: res
        };
      }
    }
  }
  static async add(ctx) {
    let data = ctx.request.body;
    if (data) {
      console.log(data);
      let res = await SMSModel.AddRecord(data);
      if (res) {
        ctx.body = {
          result: res
        };
      }
    }
  }
  static async Update(ctx) {
    let data = ctx.request.query;
    console.log(data);
    // if(data)
    // {
    //     let res =await SMSModel.UpdateRecord(data)
    //         if(res)
    //         {
    //             ctx.body={
    //                 code:1,
    //                 msg:'修改成功'
    //             }
    //         }
    // }
  }
}

module.exports = SMSController;
