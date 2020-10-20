const db = require("../config/db");
const gov = db.gov;
// const Lim_LS_FS_report = gov.import('../schema/Lim_LS_FS_report')
const UserPhone = gov.import("../schema/LIM_UsersPhone");
const Department = gov.import("../schema/LIM_Department");

const DXRM = gov.import("../schema/LIM_DXRM");
UserPhone.belongsTo(Department, {
  foreignKey: "Department_ID",
  targetKey: "DepartmentId",
  as: "DEP"
});
UserPhone.belongsTo(DXRM, { foreignKey: "Department_ID", targetKey: "DepID" });
const Sequelize = require("sequelize");
var moment = require("moment");
// Department.hasMany(UserPhone, { foreignKey:'Department_ID'})
// Department.hasMany(UserPhone,{foreignKey:'Department_ID' ,as:'Us'})
// UserPhone.belongsTo(DXRM, {sourceKey:'DepID', targetKey: 'Department_ID'})
//  UserPhone.hasOne(Department, { foreignKey: 'DepartmentId'})//DepartmentId
// User.hasOne(UserInfo, { foreignKey: 'uid', as: 'info' })
// Department.hasOne(UserPhone, { foreignKey: 'Department_ID',  })

// Department.hasMany(UserPhone,{foreignKey:'Department_ID' ,as:'U'})
// sourceKey:'ID', foreignKey:
const Op = Sequelize.Op;

// [Op.and]: {a: 5}           // 且 (a = 5)
// [Op.or]: [{a: 5}, {a: 6}]
class DXRM_VModel {
  static async GetDeplistGroupByDepID(data) {
    const depCount = await DXRM.findAndCount({
      where: {
        DepID: data.DepID
      },
      raw: true
    });
    return depCount;
  }
  static async GetAllDeplists() {
    const Deplists = await Department.findAndCount();
    return Deplists;
  }
  static async GetDepListLikeName(data) {
    const deplist = await Department.findAll({
      limit: 6,
      where: {
        [Op.or]: [
          { DepartmentName: { [Op.like]: "%" + data.DepName + "%" } }, //like和or连用
          { UploadDir: { [Op.like]: "%" + data.DepName + "%" } }
        ]
        // DepartmentName:{
        //     [Op.like]:'%' +data.DepName + '%'
        // }
      }
      // where:{
      //     DepartmentName:data.DepName
      // }
    });
    if (deplist.length === 0) {
      return false;
    } else {
      return deplist;
    }
  }
  static async finduserByTel(data) {
    const userInfomation = await UserPhone.findOne({
      where: {
        [Op.or]: [
          { cellphone: data.cellphone },
          { H_cellphone: data.cellphone }
        ]
      },
      attributes: [
        "UserName",
        Sequelize.col("DEP.DepartmentName"), //内容
        Sequelize.col("DEP.Abbreviation"), //部门简称
        Sequelize.col("DEP.DepartmentId"), //内容
        Sequelize.col("LIM_DXRM.ID"), //内容
        //  Sequelize.col('LIM_DXRM.UserName'),//内容
        Sequelize.col("LIM_DXRM.Tel"), //内容
        Sequelize.col("LIM_DXRM.createdAt"), //内容
        Sequelize.col("LIM_DXRM.DepID") //内容
      ],
      include: [
        {
          model: Department,
          as: "DEP",
          attributes: []
        },
        {
          model: DXRM,
          attributes: []
        }
      ],
      raw: true
    });
    return userInfomation;
  }
  static async GetUserInformation(data) {
    const userInfomation = await UserPhone.findOne({
      attributes: [
        // 'UserName',
        Sequelize.col("DEP.DepartmentName"), //内容
        Sequelize.col("LIM_DXRM.ID"), //内容
        Sequelize.col("LIM_DXRM.UserName"), //内容
        Sequelize.col("LIM_DXRM.Tel"), //内容
        Sequelize.col("LIM_DXRM.createdAt"), //内容
        Sequelize.col("LIM_DXRM.DepID") //内容
      ],
      include: [
        {
          model: Department,
          as: "DEP",
          attributes: []
        },
        {
          model: DXRM,
          attributes: [],
          where: {
            [Op.or]: [
              { Tel: data.cellphone }
              // { H_cellphone: '15243990018'  }
            ]
          }
        }
      ],
      raw: true
    });
    return userInfomation;
  }
  static async createUser(data) {
    const now = Date.now();
    let User = DXRM.create({
      UserName: data.UserName,
      Tel: data.Tel,
      status: data.status,
      DepID: data.DepID,
      createdAt: now,
      updatedAt: now
    }).then(r => {
      if (r.ID) {
        return { isok: true, r };
      }
      return { isok: false };
    });
    return User;
  }
  static async findUser(data) {
    const isExist = DXRM.findOne({
      where: {
        Tel: data.Tel
      }
    }).then(r => {
      if (!r) {
        return false;
      } else {
        return true;
      }
    });
    return isExist;
  }
  // SELECT JdId, sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
  // FROM      totalall
  // GROUP BY jiedao,JdId order by allCount desc

  // SELECT JdId,  sum(Acount) as aCount, sum(Bcount) as bCount, sum(Ccount) as cCount, sum(Dcount) as dCount, sum(CountAll) as allCount, jiedao
  // FROM      localPerson_total
  // GROUP BY jiedao,JdId order by allCount desc
}

module.exports = DXRM_VModel;
