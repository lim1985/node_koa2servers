/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_UsersPhone",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      GroupID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UserName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Permission_Key: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Department_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UJOB: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Tel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      H_Tel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      cellphone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      H_cellphone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      QQ: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      inTime: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      Sex: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      BirthDay: {
        type: DataTypes.DATE,
        allowNull: true
      },
      Type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      OrderID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Py_Index: {
        type: DataTypes.STRING,
        allowNull: true
      },
      beizhu: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      timestamps: false,
      tableName: "LIM_UsersPhone"
    }
  );
};
