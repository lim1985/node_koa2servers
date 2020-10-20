/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_SMSMorecord",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DepID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      sendtime: {
        type: DataTypes.DATE,
        allowNull: true
      },

      UserName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      moContent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      moible: {
        type: DataTypes.STRING,
        allowNull: true
      },
      moDepName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      moDepID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
      // moDepID:result.M_Dep.DepartmentId,
      // moDepName:result.M_Dep.DepartmentName,

      // moDepName:{
      //   type: DataTypes.STRING,
      //   allowNull: true
      // }
    },
    {
      tableName: "LIM_SMSMorecord"
    }
  );
};
