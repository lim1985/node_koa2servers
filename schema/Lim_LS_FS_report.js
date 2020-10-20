/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Lim_LS_FS_report",
    {
      ReportId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      // name nvarchar(20),

      C_class_jiechu_type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // tel	nvarchar(14),
      tel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // sex bit,
      sex: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      // idcard nvarchar(20),
      idcard: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // FJsheng nvarchar(20),
      FJsheng: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // FJshi nvarchar(20),
      FJshi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // FJquxian nvarchar(20)	,
      FJquxian: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // hangBan nvarchar(100),
      hangBan: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // kaiShidi nvarchar(100),
      kaiShidi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // jieShudi nvarchar(100),
      jieShudi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // muDidi nvarchar(100),
      muDidi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // carNum	nvarchar(20),
      carNum: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // juzhuType nvarchar(20),
      juzhuType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // xiangZhen nvarchar(50),
      xiangZhen: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // CunSheQu nvarchar(50),
      CunSheQu: {
        type: DataTypes.STRING,
        allowNull: true
      },
      jiedao: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // xiaoQu nvarchar(50),
      xiaoQu: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // louDong	nvarchar(20),
      louDong: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // fangHao nvarchar(10),
      fangHao: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // LS_muDi nvarchar(10),
      LS_muDi: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // LS_workType nvarchar(10),
      LS_workType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // LS_workArea nvarchar(20),
      LS_workArea: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // D_class	bit,
      D_class: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      D_class_LkwhDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      // D_class_LkwhDate datetimeoffset(2),
      inputTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      EditCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SQId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      JdId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      personType: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      kakID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FJaddress: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SQaddress: {
        type: DataTypes.STRING,
        allowNull: true
      },

      EditTime: {
        type: DataTypes.DATE,
        allowNull: true
      },
      // A_class bit,
      A_class: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      // A_class_LkhbDate datetimeoffset(2),
      A_class_LkhbDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      // C_class bit ,
      C_class: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      // C_class_jiechuDate datetimeoffset(2),
      C_class_jiechuDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      // LS_14_before bit,
      LS_14_before: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      // B_class bit,
      B_class: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      // B_class_LkhbDate  datetimeoffset(2),
      // B_class_LkhbDate: {
      //   type: DataTypes.DATE,
      //   allowNull: true
      // },
      // isOK bit
      isOK: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      tableName: "Lim_LS_FS_report"
    }
  );
};
