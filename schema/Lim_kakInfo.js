/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Lim_kakInfo",
    {
      createTimes: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createUserId: {
        //从电话本来
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OrderID: {
        //排序ID
        type: DataTypes.INTEGER,
        allowNull: true
      },
      kakID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DepID: {
        //街道ID
        type: DataTypes.INTEGER,
        allowNull: false
      },
      SQID: {
        //社区ID
        type: DataTypes.INTEGER,
        allowNull: false
      },
      kk_name: {
        //卡口名
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "Lim_kakInfo"
    }
  );
};
