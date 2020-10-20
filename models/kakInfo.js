const db = require("../config/db");
const gov = db.gov;
const Lim_KakInfo = gov.import("../schema/Lim_kakInfo");

const LIM_CustomGroup = gov.import("../schema/LIM_CustomGroup"); //自定义组
const LIM_RefereceGroup = gov.import("../schema/LIM_RefereceGroup"); //引用组
const LIM_RefereceGroupAndUserPhone = gov.import(
  "../schema/LIM_RefereceGroupAndUserPhone"
); //组里的人

const Sequelize = require("sequelize");
var moment = require("moment");
// UserPhone.hasOne(Department, { targetKey:'DepartmentId'})

// UserPhone.hasOne(Department, { foreignKey: 'DepartmentId'})//DepartmentId
// User.hasOne(UserInfo, { foreignKey: 'uid', as: 'info' })
// Department.hasOne(UserPhone, { foreignKey: 'Department_ID',  })
// Department.hasMany(UserPhone,{foreignKey:'Department_ID' ,as:'U'})
// sourceKey:'ID', foreignKey:
const Op = Sequelize.Op;

// [Op.and]: {a: 5}           // 且 (a = 5)
// [Op.or]: [{a: 5}, {a: 6}]
class Lim_KakInfo_VModel {
  static async getKakoAllInfo(data) {
    return new Promise(async (resolve, reject) => {
      let result = await Lim_KakInfo.findAndCountAll();
      resolve(result);
    }).catch(err => reject(err));
  }
  static async add_GroupRefere(data) {
    return new Promise((resolve, reject) => {
      LIM_RefereceGroup.create(data).then(res => {
        if (res) {
          resolve({
            code: 1000,
            res
          });
        }
      });
    }).catch(err => {
      reject(err);
    });
  }

  static async add_CustomGroup(data) {
    return new Promise((resolve, reject) => {
      LIM_CustomGroup.create(data)
        .then(res => {
          if (res) {
            resolve({
              code: 1000,
              res
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static async addkako(data) {
    return new Promise((resolve, reject) => {
      Lim_KakInfo.create(data)
        .then(res => {
          if (res) {
            resolve({
              code: 1000,
              res
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static async selectkako(data) {
    return new Promise((resolve, reject) => {
      Lim_KakInfo.findAll({
        where: {
          DepID: data.DepID,
          SQID: data.SQID
        },
        order: [["OrderID", "Desc"]]
      })
        .then(res => {
          if (res) {
            resolve({
              code: 1000,
              res
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // static async AuditLog(data)
  // {
  //     return new Promise((reslove,reject)=>{
  //         Lim_LS_FS_report.update({status:99},{
  //             where:{
  //                 ReportId:data.AuditbyReportId
  //             }
  //         }).then(async res=>{
  //             console.log(res)
  //             if(res[0]==1)
  //             {
  //                 var now = new Date();

  //                data.AuditTime=  moment(now.toString()).format('YYYY-MM-DD HH:mm:ss');
  //                 let result=await AuditLog.create(data)
  //                 console.log(result)
  //                 if(result)
  //                 {
  //                     reslove({
  //                         code:1000,
  //                         msg:'修改成功.'
  //                     })
  //                 }

  //             }
  //         }).catch(err=>{
  //             reject(err)
  //         })

  //     })
  // }

  // static async getAdmininfo(data)
  // {
  //     return new Promise((resolve,reject)=>{
  //         Department.findOne({
  //             attributes: [
  //            'DepartmentName',
  //             // Sequelize.col('users.UserName'),
  //             // Sequelize.col('users.UJOB'),

  //          ],
  //             include:[{
  //                 model: UserPhone,
  //                 as:'U',
  //                 attributes: ['ID','UserName','UJOB','status'],
  //                 where:{
  //                     status: 9,
  //                     cellphone:data.cellphone
  //                 },
  //             }],
  //             raw:true,
  //         }).then(res=>{
  //             resolve(res)
  //         })

  //     })
  // }

  // static async update(data)
  // {
  //     return new Promise(async(resolve,reject)=>{
  //         const res=await Lim_LS_FS_report.update( data , {
  //                 where:{
  //                     tel:data.tel,
  //                     ReportId:data.ReportId
  //                 }
  //             })
  //             if(res)
  //             {
  //                 if(res[0]==1)
  //                 {
  //                     resolve(true)
  //                 }
  //                 console.log(res)

  //             }
  //             else
  //             {
  //               reject(new Error)
  //             }

  //     })
  // }
  // static async update(data,{
  //     where:{
  //         ReportId:data.ReportId

  //     }
  // }){
  //     return new Promise((resolve,reject)=>{

  //         Lim_LS_FS_report.create(data).then(res=>{
  //             if(res)
  //             {
  //               resolve(res)
  //             }
  //         }).catch(err=>{
  //             reject(err)
  //         })
  //     })
  // }

  // static async getUserinfo(data){
  //     return new Promise((resolve,reject)=>{

  //         Lim_LS_FS_report.findOne({
  //             where:{
  //                 [Op.or]: [
  //                     {ReportId:data.ReportId},
  //                     {tel: data.tel}
  //                 ]
  //                 // ReportId:data.ReportId
  //             }
  //         }).then(res=>{
  //             console.log(res)
  //             if(res)
  //             {

  //               resolve(res)
  //             }
  //             else
  //             {
  //                 resolve({
  //                     code:-1,
  //                     msg:'查无记录'
  //                 })
  //             }
  //         }).catch(err=>{
  //             reject(err)
  //         })
  //     })
  // }

  // static async checkTel(data){
  //     return new Promise((resolve,reject)=>{
  //         Lim_LS_FS_report.findOne({
  //             where:{
  //                 tel:data.tel
  //             }
  //         }).then(res=>{
  //             let isexect
  //             if(!res)
  //             {
  //                 isexect=false
  //             }
  //             else
  //             {
  //                 isexect=true
  //             }
  //             console.log(res)
  //             console.log(typeof(res))
  //             resolve(isexect)
  //             // if(res.length>0)
  //             // {
  //             //   resolve(false)
  //             // }
  //         }).catch(err=>{
  //             reject(err)
  //         })
  //     })
  // }
}

module.exports = Lim_KakInfo_VModel;
