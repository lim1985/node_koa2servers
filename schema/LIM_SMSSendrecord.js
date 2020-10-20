/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_SMSSendrecord",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DPname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GuID: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TID: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AdminID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      time: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SMSContent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UserName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DepID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "LIM_SMSSendrecord"
    }
  );
};
