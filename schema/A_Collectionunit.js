/* jshint indent: 2 */
//申请单位
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "A_Collectionunit",
    {
      UUID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      Telnum: {
        type: DataTypes.STRING,
        allowNull: false
      },
      TagetsName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Location: {
        type: DataTypes.STRING,
        allowNull: false
      },
      wxID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isok: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      times: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: "A_Collectionunit"
    }
  );
};
