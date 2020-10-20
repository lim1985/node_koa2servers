/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LIM_DXRM",
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      UserName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Tel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DepID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      timestamps: false,
      paranoid: true,
      // createdAt:'created_at',
      // updatedAt:'updated_at',
      // deletedAt:'deleted_at',
      tableName: "LIM_DXRM"
    }
  );
};
