const db = require("../config/db");
const gov = db.gov;
const Lim_LS_FS_report = gov.import("../schema/Lim_LS_FS_report");
const UserPhone = gov.import("../schema/LIM_UsersPhone");
const Department = gov.import("../schema/LIM_Department");
const AuditLog = gov.import("../schema/LIM_AuditLog");

const Sequelize = require("sequelize");
var moment = require("moment");
// UserPhone.hasOne(Department, { targetKey:'DepartmentId'})

// UserPhone.hasOne(Department, { foreignKey: 'DepartmentId'})//DepartmentId
// User.hasOne(UserInfo, { foreignKey: 'uid', as: 'info' })
// Department.hasOne(UserPhone, { foreignKey: 'Department_ID',  })
Department.hasMany(UserPhone, { foreignKey: "Department_ID", as: "U" });
// sourceKey:'ID', foreignKey:
const Op = Sequelize.Op;

// [Op.and]: {a: 5}           // 且 (a = 5)
// [Op.or]: [{a: 5}, {a: 6}]
class LS_FS_VModel {
  // SELECT JdId, sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
  // FROM      totalall
  // GROUP BY jiedao,JdId order by allCount desc

  // SELECT JdId,  sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
  // FROM      localPerson_total
  // GROUP BY jiedao,JdId order by allCount desc
  static async local_personTypeBe15day() {
    return new Promise(async (reslove, reject) => {
      let sql = `SELECT JdId,  sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
            FROM localPerson_total GROUP BY jiedao,JdId order by allCount desc`;
      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });
      reslove(res);
    }).catch(err => reject(err));
  }

  static async fs_personTypeBe15day() {
    return new Promise(async (reslove, reject) => {
      let sql = `SELECT JdId, sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
            FROM  totalall GROUP BY jiedao,JdId order by allCount desc`;
      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });
      reslove(res);
    }).catch(err => reject(err));
  }
  static async initBE15DayFS_PersonOrLocal(data) {
    return new Promise(async (reslove, reject) => {
      let sql = `SELECT COUNT(CunSheQu) AS counts,A_class,B_class,C_class,D_class,jiedao
            FROM Lim_LS_FS_report where  personType=${data.personType} and DateDiff(dd,inputTime,getdate())<=15 GROUP BY  A_class, B_class, D_class, C_class,jiedao order by jiedao `;
      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });
      reslove(res);
    }).catch(err => reject(err));
  }
  static async getAllDataGroupbyJDID(data) {
    return new Promise(async (reslove, reject) => {
      let sql = `SELECT COUNT(*) AS counts, jiedao, JdId FROM Lim_LS_FS_report GROUP BY jiedao, JdId order by counts desc`;
      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });
      reslove(res);
    }).catch(err => reject(err));
  }

  //     SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType,
  // status FROM Lim_LS_FS_report where DateDiff(dd,inputTime,getdate())<=15 GROUP BY A_class, B_class, D_class, C_class, personType, status
  static async getbefore15DataCounts(data) {
    return new Promise(async (reslove, reject) => {
      let sql = "";
      if (data.jdId == "-1") {
        cd;
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where jdid is null and  DateDiff(dd,inputTime,getdate())<=15 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else if (JSON.stringify(data).indexOf("{}") == -1 && data.jdId) {
        console.log(`有参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and jdid=${data.jdId} and  DateDiff(dd,inputTime,getdate())<=15 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else {
        console.log(`无参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and DateDiff(dd,inputTime,getdate())<=15 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      }

      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });

      reslove(res);
    });
  }
  static async getyesDayDataCounts(data) {
    return new Promise(async (reslove, reject) => {
      let sql = "";
      if (JSON.stringify(data).indexOf("{}") == -1 && data.jdId) {
        console.log(`有参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and jdid=${data.jdId} and  DateDiff(dd,inputTime,getdate())=1 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else {
        console.log(`无参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and DateDiff(dd,inputTime,getdate())=1 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      }

      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });

      reslove(res);
    });
  }
  static async getTodayDataCounts(data) {
    return new Promise(async (reslove, reject) => {
      let sql = "";
      if (JSON.stringify(data).indexOf("{}") == -1 && data.jdId) {
        console.log(`有参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and jdid=${data.jdId} and  DateDiff(dd,inputTime,getdate())=0 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else {
        console.log(`无参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where personType=${data.personType} and DateDiff(dd,inputTime,getdate())=0 GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      }

      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });

      reslove(res);
    });
  }
  static async getDataCounts(data) {
    return new Promise(async (reslove, reject) => {
      let sql = "";
      if (data.jdId == "-1") {
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where jdid is null GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else if (JSON.stringify(data).indexOf("{}") == -1 && data.jdId) {
        console.log(`有参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report where jdid=${data.jdId}  GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      } else {
        console.log(`无参数`);
        sql = `SELECT COUNT(CunSheQu) AS counts, A_class, B_class, D_class, C_class, personType, status FROM Lim_LS_FS_report GROUP BY A_class, B_class, D_class, C_class, personType, status`;
      }

      let res = {};
      res.rows = await gov.query(sql, { type: gov.QueryTypes.SELECT });

      reslove(res);
    });
  }

  static async addRecords(data) {
    return new Promise(async (resolve, reject) => {
      if (data.action == "Update") {
        //需要观察的人
        // if(data.status=="99")
        // {
        Lim_LS_FS_report.update(data, {
          where: {
            ReportId: data.ReportId
          }
        })
          .then(async res => {
            console.log(res);
            console.log(data.Auditdata);
            if (res[0] == 1) {
              if (data.gcly != "") {
                data.Auditdata.UserPhone = data.tel;
                data.Auditdata.AuditMind = data.gcly;
                data.Auditdata.AuditTime = moment().format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                );
                let result = await AuditLog.create(data.Auditdata);
                if (result) {
                  resolve({
                    code: 1000,
                    msg: "修改成功."
                  });
                }
              }
              resolve({
                code: 1000,
                msg: "修改成功."
              });
            }
          })
          .catch(err => {
            reject(err);
          });
        // }
        // else
        // {
        //   let result=await LS_FS_VModel.updateRecord(data)
        //   resolve(result)
        // }
      } else {
        Lim_LS_FS_report.create(data)
          .then(async res => {
            if (data.status == "99") {
              data.Auditdata.AuditbyReportId = res.ReportId;
              data.Auditdata.UserPhone = data.tel;
              data.Auditdata.AuditMind = data.gcly;
              data.Auditdata.AuditTime = moment().format(
                "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
              );
              let result = await AuditLog.create(data.Auditdata);
              if (result) {
                resolve({
                  res,
                  code: 1000,
                  msg: "创建成功."
                });
              }
            } else {
              resolve({
                res,
                code: 1000,
                msg: "创建成功."
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  }

  static async AuditLog(data) {
    console.log(data);
    return new Promise((reslove, reject) => {
      Lim_LS_FS_report.update(
        { status: data.status },
        {
          where: {
            ReportId: data.AuditbyReportId
          }
        }
      )
        .then(async res => {
          console.log(res);
          if (res[0] == 1 && data.status != 1) {
            data.AuditTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            let result = await AuditLog.create(data);
            console.log(result);
            if (result) {
              reslove({
                code: 1000,
                msg: "创建成功."
              });
            }
          }
          reslove({
            code: 1000,
            msg: "创建成功."
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static async getAdmininfo(data) {
    return new Promise((resolve, reject) => {
      Department.findOne({
        attributes: [
          "DepartmentName",
          "Permission_Key"
          // Sequelize.col('users.UserName'),
          // Sequelize.col('users.UJOB'),
        ],
        include: [
          {
            model: UserPhone,
            as: "U",
            attributes: ["ID", "UserName", "UJOB", "status"],
            where: {
              // [Op.in]: [1, 2],
              status: { [Op.gt]: 7 },

              // status: 9,
              cellphone: data.cellphone
            }
          }
        ],
        raw: true
      }).then(res => {
        resolve(res);
      });
    });
  }
  static async add(data) {
    return new Promise((resolve, reject) => {
      Lim_LS_FS_report.create(data)
        .then(res => {
          if (res) {
            resolve(res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static async update(data) {
    return new Promise(async (resolve, reject) => {
      const res = await Lim_LS_FS_report.update(data, {
        where: {
          tel: data.tel,
          ReportId: data.ReportId
        }
      });
      if (res) {
        if (res[0] == 1) {
          resolve(true);
        }
        console.log(res);
      } else {
        reject(new Error());
      }
    });
  }

  static async updateRecord(data) {
    return new Promise(async (resolve, reject) => {
      const res = await Lim_LS_FS_report.update(data, {
        where: {
          ReportId: data.ReportId
        }
      });
      if (res) {
        if (res[0] == 1) {
          resolve(true);
        }
        console.log(res);
      } else {
        reject(new Error());
      }
    });
  }
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

  static async getUserinfo(data) {
    console.log(`-----------------`);
    console.log(data);
    console.log(`-----------------`);
    return new Promise((resolve, reject) => {
      Lim_LS_FS_report.findOne({
        where: {
          [Op.or]: [{ ReportId: data.ReportId }, { tel: data.tel }]
          // ReportId:data.ReportId
        }
      })
        .then(res => {
          console.log(res);
          if (res) {
            resolve(res);
          } else {
            resolve({
              code: -1,
              msg: "查无记录"
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static async checkTel(data) {
    return new Promise((resolve, reject) => {
      Lim_LS_FS_report.findOne({
        where: {
          tel: data.tel
        }
      })
        .then(res => {
          let isexect;
          if (!res) {
            isexect = false;
          } else {
            isexect = true;
          }
          console.log(res);
          console.log(typeof res);
          resolve(isexect);
          // if(res.length>0)
          // {
          //   resolve(false)
          // }
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

module.exports = LS_FS_VModel;
