/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "A_C_V",
    {
      C_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      V_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "A_C_V"
    }
  );
};
