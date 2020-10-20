/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_Department",
    {
      DepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DepartmentName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Permission_Key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      UploadDir: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Abbreviation: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ParentDepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Priority: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Number: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: "LIM_Department"
    }
  );
};
