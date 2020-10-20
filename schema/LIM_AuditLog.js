/* jshint indent: 2 */
//审核记录
const Sequelize = require("sequelize");
var moment = require("moment");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_AuditLog",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      AuditName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UserPhone: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AuditTel: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AuditDepartMent: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AuditTime: {
        type: Sequelize.DATE,
        get() {
          return moment(this.getDataValue("createdAt")).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
      },
      ActionCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      AuditbyReportId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      AuditMind: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "LIM_AuditLog"
    }
  );
};
