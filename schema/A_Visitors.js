/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "A_Visitors",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      visitorName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sex: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Tel: {
        type: DataTypes.STRING,
        allowNull: false
      },
      visitorWxID: {
        type: DataTypes.STRING,
        allowNull: false
      },

      visitingMan: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      visitorTimes: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "A_Visitors"
    }
  );
};
