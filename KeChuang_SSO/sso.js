const http = require("http");
const querystring = require("querystring");

class kechuang_sso {
  // static getCode(ctx)
  // {
  //     let myquery=ctx.query.code;
  //     return myquery
  // }
  static req_code(ctx) {
    return new Promise((resolve, reject) => {
      //测试获取code:http://xndt.egp.c2cloud.cn/hnvirtualhall/register/jsp/querycodedo.jsp
      //测试地址获取身份:http://api.egp.c2cloud.cn/sso/v1/userinfo?code=i1TXm1sEQHaClCGFb4o7ig&fields=name
      //测试 api-key：6FwrMN5icSHSxqYicUaib6XtA
      //正式获取code地址
      //正式获取身份地址:http://api.zwfw.hunan.gov.cn/sso/v1/userinfo?code=***&fields=name
      //正式api-key：MfgXpPQOSVWeZjJJvaAl2w
      //  console.log(url)
      //    var mycode=kechuang_sso.getCode(ctx);
      //    console.log(mycode)
      var mycode = ctx.query.code;
      // console.log(ctx.query.code)
      var data = {
        code: mycode,
        fields: [
          "name",
          "certificateNum",
          "phone",
          "sex",
          "email",
          "addr",
          "loginType"
        ]
        //    name:'name',
        //    ccard:'certificateNum'
      };
      var content = querystring.stringify(data);
      //code=Z_L-lSwpRXSjlBBnh-Fjxg&fields=name',
      var options = {
        hostname: "api.zwfw.hunan.gov.cn",
        path: "/sso/v1/userinfo?" + content,
        headers: {
          "X-API-KEY": "MfgXpPQOSVWeZjJJvaAl2w",
          accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        }
      };
      // console.log(options)
      var req = http.request(options, function(res) {
        res.setEncoding("utf-8");
        res.on("data", result => {
          console.log(result);
          // console.log(statusStr(result));
          resolve(result);
        });
        res.on("end", function() {});
      });

      req.on("error", function(reject) {
        console.error(reject);
      });
      req.end();
    });
    // http://xndt.egp.c2cloud.cn/hnvirtualhall/register/jsp/querycodedo.jsp
    var url =
      "http://xndt.egp.c2cloud.cn/hnvirtualhall/register/jsp/querycodedo.jsp";
    console.log(url);
    var req = http.request(url, function(res) {
      console.log(res);
    });
    // req.on('error',function(err){
    //     console.log('出错了')
    //   //  console.error(err);
    // });
    // req.end();
  }
  static async getUserinfo(ctx, next) {
    //apikey=6FwrMN5icSHSxqYicUaib6XtA
    // return new Promise((resolve,reject)=>{
    //    ctx.header.set('X-API-KEY','6FwrMN5icSHSxqYicUaib6XtA')
    //    ctx.header.set('accept','application/json')
    //    ctx.header.set('Content-Type','application/json;charset=UTF-8')
    var c = await kechuang_sso.req_code(ctx);
    ctx.body = {
      c
    };

    //     let code = kechuang_sso.getCode(ctx)
    //     console.log(code)
    //     // resolve(code)
    //     let data ={
    //         code:'olaQA0suTRewJFJYwjBV1g',
    //         fields:'name'
    //     }
    //     let url='api.egp.c2cloud.cn'
    //     var content=querystring.stringify(data);
    //     let options={
    //         hostname:url,
    //         path:'/sso/v1/userinfo?'+content
    //     }
    //     console.log(content)
    //     console.log(options)
    //     // ctx.set.('X-API-KEY','6FwrMN5icSHSxqYicUaib6XtA');
    //     // ctx.request.setHeader("accept", "application/json");
    //     // ctx.request.setHeader("Content-Type","application/json;charset=UTF-8");
    //     var req=http.request(options,function(res){
    //         res.header=('X-API-KEY','6FwrMN5icSHSxqYicUaib6XtA')
    //         res.header=('accept','application/json')
    //         res.header=('Content-Type','application/json;charset=UTF-8')
    // // httpGet.setHeader("accept", "application/json");
    // // httpGet.setHeader("X-API-KEY", "6FwrMN5icSHSxqYicUaib6XtA");
    // // httpGet.setHeader("Content-Type","application/json;charset=UTF-8");

    //       console.log(res)
    //     })
    //     req.on('error',function(reject){
    //         console.log('出错了')
    //       //  console.error(reject);
    //     });
    //     req.end();
    //   //http://api.egp.c2cloud.cn/sso/v1/userinfo?code=***&fields=name
    //    ctx.request.headers='111111'

    // })
  }
}
module.exports = kechuang_sso;
