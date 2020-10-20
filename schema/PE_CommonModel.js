/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PE_CommonModel",
    {
      GeneralID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      NodeID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ModelID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ItemID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TableName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      InputDepartmentName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Inputer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Hits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      DayHits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      WeekHits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      MonthHits: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      LinkType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      UpdateTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      CreateTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      TemplateFile: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      EliteLevel: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Priority: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CommentAudited: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      CommentUnAudited: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      SigninType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      InputTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      PassedTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      Editor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LastHitTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      DefaultPicUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PinyinTitle: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TitleFontColor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TitleFontType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IncludePic: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ShowCommentLink: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      TitleHashKey: {
        type: DataTypes.DECIMAL,
        allowNull: true
      },
      HtmlPageName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SGType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      },
      SGDataId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "((0))"
      }
    },
    {
      tableName: "PE_CommonModel"
    }
  );
};
