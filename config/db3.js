const Sequelize = require("sequelize");
const config = {
  database: "yqgl",
  username: "yqgl",
  password: "TbRAvwAIFm76lUAn",
  host: "112.74.35.158",
  port: 18016
};
const gov2 = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: "mysql", //'mysql'|'sqlite'|'postgres'|'mssql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000
  },
  define: {
    timestamps: false
  }
});
gov2
  .authenticate() //连接测试
  .then(() => {
    console.log("数据库连接成功!");
  })
  .catch(err => {
    console.log(err);
  });
module.exports = {
  gov2
};
