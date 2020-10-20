/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Lim_resultReport",
    {
      status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createTimes: {
        type: DataTypes.DATE,
        allowNull: false
      },

      resultId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ReportId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      result: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "Lim_resultReport"
    }
  );
};
