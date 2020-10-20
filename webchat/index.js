const http = require("http");
var querystring = require("querystring");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class webchat {
  static ToUnicode(str) {
    var txt = escape(str).replace(/%u/gi, "\\u");
    return txt
      .replace(/%7b/gi, "{")
      .replace(/%7d/gi, "}")
      .replace(/%3a/gi, ":")
      .replace(/%2c/gi, ",")
      .replace(/%27/gi, "'")
      .replace(/%22/gi, '"')
      .replace(/%5b/gi, "[")
      .replace(/%5d/gi, "]")
      .replace(/%3D/gi, "=")
      .replace(/%20/gi, " ")
      .replace(/%3E/gi, ">")
      .replace(/%3C/gi, "<")
      .replace(/%3F/gi, "?");
  }
  static ToGB2312(str) {
    return unescape(str.replace(/\\u/gi, "%u"));
  }

  static async get(params) {
    return new Promise((resolve, reject) => {
      var data = {
        key: "2d7f38a9e540576bf240b97ce1157cdbc13241a7a1d8e94b5b629620",
        url: params.url
      }; //这是需要提交的数据
      var content = querystring.stringify(data);
      var options = {
        hostname: "whosecard.com",
        port: 8081,
        path: "/api/msg/ext?" + content,
        method: "GET"
      };
      console.log(encodeURI(options));
      var req = http.request(options, function(res) {
        console.log("STATUS: " + res.statusCode);
        console.log("HEADERS: " + JSON.stringify(res.headers));
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
          console.log("BODY: " + chunk);
          resolve(chunk);
        });
      });
      req.on("error", function(e) {
        console.log("problem with request: " + e.message);
      });
      req.end();
    });
  }
}
module.exports = webchat;
