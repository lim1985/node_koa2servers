/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_RefereceGroupAndUserPhone",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      GroupID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      UserPhoneID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: "LIM_RefereceGroupAndUserPhone"
    }
  );
};
