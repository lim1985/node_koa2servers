const db = require("../config/db");
const gov = db.gov;
const A_Collectionunit = gov.import("../schema/A_Collectionunit.js");
const A_Visitor = gov.import("../schema/A_Visitors.js");
const A_C_V = gov.import("../schema/A_C_V.js");
const Sequelize = require("sequelize");
// A_Collectionunit.belongsToMany(A_Visitor, {  as: 'A_V', through: A_C_V,sourceKey:'UUID', foreignKey: 'Uuid' })
//A_Visitor.belongsToMany(A_Collectionunit, {  as: 'A_C',through: A_C_V ,sourceKey:'Tel', foreignKey: 'Tel'})
// A_Collectionunit.belongsToMany(A_Visitor, { as: 'A_V', through: {model:A_C_V } ,sourceKey:'UUID', foreignKey: 'Uuid' })
//A_Collectionunit.hasMany(A_Visitor,{through: A_C_V,foreignKey:'UUID',sourceKey:'Tel',as:'A_V'})
//A_Collectionunit.belongsToMany(A_Visitor, {through: A_C_V,foreignKey:'UUID', targetKey: 'Uuid'})

//A_Visitor.belongsToMany(A_Collectionunit, {through: A_C_V,foreignKey:'Tel', targetKey: 'Tel'})

// A_Collectionunit.belongsToMany(A_Visitor, {through: A_C_V,foreignKey: 'UUID'})
// //,order:[ ['OrderID', 'DESC'],]
//   A_Visitor.belongsToMany(A_Collectionunit, {through: A_C_V,foreignKey: 'Tel'})
A_Collectionunit.belongsToMany(A_Visitor, {
  through: A_C_V,
  sourceKey: "UUID",
  foreignKey: "C_ID"
});
A_Visitor.belongsToMany(A_Collectionunit, {
  through: A_C_V,
  sourceKey: "ID",
  foreignKey: "V_ID"
});

//UserPhone.belongsToMany(Deps, {  as: 'Deps',through: DEPUsers ,sourceKey:'ID', foreignKey: 'UserPhoneID'})

// Deps.belongsToMany(UsersPhone, {through: ResferenceUserPhoneAndDEP, as:'ResferecDep',sourceKey:'DepartmentId', foreignKey: 'DepID'})
// //,order:[ ['OrderID', 'DESC'],]
// UsersPhone.belongsToMany(Deps, {through: ResferenceUserPhoneAndDEP, as:'ResferecDep' ,sourceKey:'ID', foreignKey: 'UserPhoneID'})
// A_Collectionunit.belongsToMany(A_Visitor, {
//     through: {
//         model: A_C_V,
//         unique: false,
//     },
//     as:'A_V',
//     sourceKey:'UUID',
//     foreignKey: 'Uuid', //通过外键postId
//     constraints: false
// });
// A_Visitor.belongsToMany(A_Collectionunit, {
//     through: {
//         model: A_C_V,
//         unique: false,
//     },
//     sourceKey:'Tel',
//     foreignKey: 'Tel', //通过外键tagId
//     constraints: false
// });
// Perinformation.belongsTo(Deps, { foreignKey: 'DepID', targetKey: 'DepartmentId', as: 'Deps' });
// Permission.hasMany(Perinformation,{foreignKey:'PermissionKey',sourceKey:'Permission_key',as:'Perinformation'})
// Perinformation.belongsTo(Deps, { foreignKey: 'DepID', targetKey: 'DepartmentId', as: 'Deps' });

// Deps.belongsToMany(UserPhone, {  as: 'Users', through: DEPUsers,sourceKey:'DepartmentId', foreignKey: 'DepID' })
// UserPhone.belongsToMany(Deps, {  as: 'Deps',through: DEPUsers ,sourceKey:'ID', foreignKey: 'UserPhoneID'})
// DepID:{
// UserPhoneID: {
class A_C_VModel {
  static async getall() {
    return new Promise((resolve, reject) => {
      A_Visitor.findAll({})
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  static async GetVistorbyTel(data) {
    try {
      return new Promise((resolve, reject) => {
        A_Collectionunit.findAndCount({
          include: [
            {
              model: A_Visitor,
              where: {
                Tel: data.tel
              }
            }
          ]
        })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async GetbyUUid(data) {
    console.log(data);
    try {
      return new Promise((resolve, reject) => {
        A_Collectionunit.findAndCount({
          attributes: ["TagetsName"],
          where: {
            UUID: data.uuid
          },
          include: [
            {
              model: A_Visitor,
              required: true,
              attributes: ["Tel", "visitorName"]
            }
          ],
          raw: true
        })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = A_C_VModel;
