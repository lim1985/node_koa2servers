/* jshint indent: 2 */
var moment = require("moment");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_Sharelink_count",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      InputTimes: {
        type: DataTypes.DATE,
        allowNull: true
      },
      shareTime: {
        type: DataTypes.DATE,
        allowNull: true
        // get() {
        //     return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        // },
        // set(shareTime)
        // {
        //  return this.setDataValue('shareTime',shareTime)
        // }
      },
      IsPush: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Inputer: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tuigaoMan: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      c_PT: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      c_auth: {
        type: DataTypes.STRING,
        allowNull: true
      },
      c_Copyfrom: {
        type: DataTypes.STRING,
        allowNull: true
      },
      c_status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      c_type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RednetID: {
        type: DataTypes.STRING,
        allowNull: true
      },
      c_link: {
        type: DataTypes.STRING,
        allowNull: true
      },
      c_hit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      C_hitGood: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      C_comment: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      endshareTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      sharer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      newsman: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cameraman: {
        type: DataTypes.STRING,
        allowNull: true
      },
      C_videoTimes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      C_videoUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "LIM_Sharelink_count"
    }
  );
};
