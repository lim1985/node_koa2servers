/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_CmccDepAccounts",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DepID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ApID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Sign: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AddSerial: {
        type: DataTypes.STRING,
        allowNull: false
      },
      EcName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      TemplateId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Params: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "LIM_CmccDepAccounts"
    }
  );
};
