const db = require("../config/db");
const gov = db.gov;
const SMS = gov.import("../schema/LIM_SMSSendrecord.js");
const SMSMO = gov.import("../schema/LIM_SMSMorecord.js");

// const jwtKoa = require('koa-jwt')

class SMSSendRecordModel {
  static async GetSmsMo(data) {
    return new Promise(async (resolve, reject) => {
      // const _data={}
      console.log(data);
      const result = await SMSMO.findAndCount({
        where: {
          DepID: data.DepID
        },
        order: [["ID", "DESC"]]
      });
      console.log(result.rows);
      if (result.count > 0) {
        resolve({ code: 1, result: result });
      } else {
        resolve({ code: -1, msg: "查无数据" });
      }
    });
  }
  static async GetSmsRecord(data) {
    return new Promise(async (resolve, reject) => {
      const result = await SMS.findAndCount({
        where: {
          DepID: data.DepID
        },
        order: [["ID", "DESC"]]
      });
      console.log(result);
      if (result.count > 0) {
        resolve({ code: 1, result: result });
      } else {
        resolve({ code: -1, msg: "查无数据" });
      }
      // const _data={}
      // const res=await SMS.findAndCount({
      //   where:{
      //     DepID:data.DepID
      //   }
      // }).catch(err=>reject(err));
      // console.log(res);
      // if(res.count>0)
      // {
      //   _data={
      //     code:1,
      //     res:res
      //   }
      //   // resolve({code:1,res})
      // }
    });
  }

  static async SaveMo(data) {
    return new Promise(async (resolve, reject) => {
      const res = await SMSMO.create(data);
      console.log(res);
    });
  }
  static async succeedCount(data) {
    return new Promise(async (resolve, reject) => {
      const res = await SMS.findAndCountAll({
        attributes: ["TID"],
        where: {
          status: 1,
          GUID: data.GUID
        }
      });
      if (res) {
        resolve(res);
      }
    });
  }
  static async AddRecord(data) {
    return new Promise(async (resolve, reject) => {
      console.log(typeof data[0]);
      console.log(data);
      SMS.bulkCreate(data).then(res => {
        console.log(res);
        if (res) {
          let Data = {
            GuID: data.GuID,
            code: res
          };
          resolve(Data);
        } else {
          reject(new Error());
        }
      });
      // const res =await SMS.bulkCreate({
      //     'GuID':data.GuID,
      //     'TID': data.TID,
      //     'UID': data.UID,
      //     'AdminID': data.AdminID,
      //     'time': data.time,
      //     'status': data.status,
      //     'SMSContent': data.SMSContent,
      //     'UserName':data.UserName
      //   })
    });
  }
  static async UpdateRecord(data) {
    console.log(data);
    // User.update({name: 'lilei'},
    // {
    //     where: {id: 1}
    // })
    return new Promise(async (resolve, reject) => {
      const res = await SMS.update(
        {
          status: data.s
        },
        {
          where: {
            TID: data.t
          }
        }
      );
      if (res) {
        let Data = {
          code: res,
          TID: data.t
        };
        resolve(Data);
      } else {
        reject(new Error());
      }
    });
  }
  /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  //   static async findUserByName (AdminName) {
  //     const userInfo = await Admin.findOne({
  //       where: {
  //         AdminName
  //       }
  //     })
  //     return userInfo
  //   }
  /**
   * 添加角色
   *
   */
  // static async dbasync()
  // {

  //   const flag= Permission.sync({force: false})

  //  if (flag)
  //  {return true}
  //  else
  //  {return false}
  // //  await Roles.sync({force: false})
  // //  return true
  // //   Roles.sync({force: false}).then(res=>{
  // //    return true
  // //  })
  // }

  /**
   * 修改角色
   * @param role
   * @returns {Promise.<boolean>}
   */
  //   static async updatePermission(data)
  //   {
  //     return  new Promise((resove,reject)=>{
  //         try {
  //             Permission.update(data,{where:{ID:data.ID}}).then(res=>
  //             {
  //               console.log(res)
  //               resove(res)
  //             }).catch(function(reject)
  //             {
  //               console.log(reject)
  //               return reject()
  //             })
  //         } catch (error) {
  //           reject(error)
  //         }
  //       })
  //   }
  //   static async updatePermission (data) {
  //     await Permission.update(data,{
  //       'Permission_name': data.Permissionvalue,
  //       'Permission_key': data.Permissionskey,
  //       'description': data.description
  //     },
  //      where:{ID:data.ID}  )
  //     return true
  //   }
  /**
   * 删除角色
   * @param role
   * @returns {Promise.<boolean>}
   */
  //   static async delPermission (data) {
  //     return  new Promise((resove,reject)=>{
  //       try {
  //         Permission.destroy({where:{ID:data}}).then(res=>
  //           {
  //             console.log(res)
  //             resove(res)
  //           }).catch(function(reject)
  //           {
  //             console.log(reject)
  //             return reject()
  //           })
  //       } catch (error) {
  //         reject(error)
  //       }
  //     })

  //   }
  /**
   * 查询所有角色
   * @param user
   * @returns {Promise.<boolean>}
   */
  //   static async findPermiss(ctx) {
  //   const Permissionlist=  await Permission.findAndCountAll(
  //     ctx,
  //     //{ offset: 0, limit: 10 },
  //      {
  //       order:Permission.addtime
  //      }
  //     )
  //     return Permissionlist
  //   }
}

module.exports = SMSSendRecordModel;
