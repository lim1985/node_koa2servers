/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Lim_invitehistory",
    {
      createTimes: {
        type: DataTypes.DATE,
        allowNull: false
      },
      byInviteUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inviteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      kakID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DepID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inviteUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "Lim_invitehistory"
    }
  );
};
