const db = require("../config/db");
const gov = db.gov;
const http = require("http");
const ShareLink = gov.import("../schema/LIM_Sharelink_count");
const querystring = require("querystring");
var Base64 = require("js-base64").Base64; //生成base64
const crypto = require("crypto"); //生成MD5
const Sequelize = require("sequelize");
var moment = require("moment");
const Op = Sequelize.Op;
//  get() {
//             return moment(this.getDataValue('shareTime')).format('YYYY-MM-DD HH:mm:ss');
//         }
class ShareLinkClass {
  static countAllshareLink(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = {};
        if (data.keyword == "媒体聚焦") {
          result = await ShareLink.findAndCountAll({
            where: {
              InputTimes: {
                $between: [data.from, data.now]
              },
              // c_status='转载'and c_pt='大祥融媒'
              c_status: !data.keyword ? "原创" : data.keyword
            }
          });
        } else {
          result = await ShareLink.findAndCountAll({
            where: {
              InputTimes: {
                $between: [data.from, data.now]
              },
              // c_status='转载'and c_pt='大祥融媒'
              c_status: !data.keyword ? "原创" : data.keyword,
              c_pt: "大祥融媒"
            }
          });
        }
        if (data.keyword == "大祥发布") {
          result = await ShareLink.findAndCountAll({
            where: {
              InputTimes: {
                $between: [data.from, data.now]
              },
              // c_status='转载'and c_pt='大祥融媒'

              c_pt: "大祥发布"
            }
          });
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDate(strDate) {
    var date = eval(
      "new Date(" +
        strDate
          .replace(
            /\d+(?=-[^-]+$)/,

            function(a) {
              return parseInt(a, 10) - 1;
            }
          )
          .match(/\d+/g) +
        ")"
    );

    return date;
  }
  static async get(data) {
    return new Promise((resolve, reject) => {
      try {
        console.log(data);
        ShareLink.findAndCount({
          where: {
            c_link: data.c_link
          }
        }).then(res => {
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static setDateTime(fnTime) {
    var x = fnTime; // 取得时间"2017-07-08 13:00:00"
    var time = new Date(x);
    var timeNum = 8; //小时数
    time.setHours(time.getHours() + timeNum);
    return time;
  }

  static async add(data) {
    //_flag
    /*
        _flag==false 是通过传链接页面直接传的
        _flag==true  是通过大祥之窗后台传的
        */
    var _flag = data.IsPush === "true" ? true : false;

    let shareTime = ShareLinkClass.setDateTime(data.shareTime);
    var now = new Date();
    console.log(now);
    console.log(now.toString());
    // moment(date, ‘YYYY/MM/DD HH:mm:ss Z‘).toDate();

    // let NowInputTimes= moment(now, 'YYYY/MM/DD HH:mm:ss Z').toDate();
    let NowInputTimes = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    data.InputTimes = NowInputTimes;
    return new Promise(async (resolve, reject) => {
      let _ArrRednet = [
        { pt: "大祥新闻网", key: "daxiang.rednet.cn" },
        { pt: "大祥融媒", key: "daxiang-wap.rednet.cn" },
        { pt: "大祥时刻", key: "moment.rednet.cn" }
      ];
      let results = await ShareLink.findOne({
        where: {
          c_link: data.c_link,
          IsPush: false
        }
      });
      if (results) {
        //如果传过来的链接 已经存在 就更新
        data.IsPush = true;
        ShareLink.update(data, {
          where: {
            ID: results.ID
          }
        }).then(s => {
          //[1]
          if (s[0] == 1) {
            resolve(true);
          }
        });
      } else {
        let _ArrData = [];
        if (_flag) {
          let domain = data.c_link.split("/");

          if (
            data.c_status == "转载" ||
            data.c_status == "原创" ||
            domain[2] == "daxiang.rednet.cn" ||
            domain[2] == "daxiang-wap.rednet.cn" ||
            domain[2] == "moment.rednet.cn"
          ) {
            _ArrRednet.forEach(v => {
              let _domain = data.c_link.split("/");
              _domain[2] = v.key;
              let _clink = _domain.join("/");
              let _obj = {
                InputTimes: NowInputTimes,
                c_PT: v.pt,
                c_link: _clink,
                shareTime: shareTime,
                C_videoUrl: data.C_videoUrl,
                cameraman: data.cameraman, //摄影/摄像
                newsman: data.newsman, //记者/通讯员
                C_videoTimes: data.C_videoTimes, //视频时长
                title: data.title, //稿件标题
                c_auth: data.c_auth, //作者
                c_Copyfrom: data.c_Copyfrom, //来源
                c_status: data.c_status, //性质 原创/转发
                c_type: data.c_type, //类型 图文/视频/H5/短视频/动漫
                c_hit: data.c_hit, //点击量
                sharer: data.sharer, //发布者
                C_hitGood: data.C_hitGood, //点赞量
                C_comment: data.C_comment, //评论量
                RednetID: data.RednetID,
                IsPush: true,
                Inputer: data.Inputer
              };
              _ArrData.push(_obj);
            });
          } else {
            _ArrData.push(data);
          }
        } else {
          _ArrData.push(data);
        }
        ShareLink.bulkCreate(_ArrData).then(res => {
          resolve(res.length > 0);
        });
      }
    });

    //     console.log(`--------`)
    //     console.log(data.IsPush)
    //     console.log(typeof(data.IsPush))
    //   //  console.log(data.IsPush = 'true' === 'true')
    //   //  console.log(data.IsPush === 'true')
    //     var _flag = data.IsPush ==='true' ? true:false;
    //     console.log(_flag)
    //     console.log(typeof(_flag))
    //     console.log(`--------`)
    //    let newdata= ShareLinkClass.setDateTime(data.shareTime)
    //    let InputTimes=moment().format('YYYY-MM-DD HH:mm:ss')
    //    data.InputTimes=InputTimes
    //     return new Promise(async (resolve,reject)=>{
    //         let _ArrRednet=[
    //             {pt:'大祥新闻网',key:'daxiang.rednet.cn'},
    //             {pt:'大祥融媒',key:'daxiang-wap.rednet.cn'},
    //             {pt:'大祥时刻',key:'moment.rednet.cn'}
    //            ]

    //         let results = await ShareLink.findOne(
    //             {
    //                 where: {
    //                 c_link:data.c_link,
    //                 IsPush:false
    //             }});
    //             if(results)//如果传过来的链接 已经存在 就更新
    //             {

    //                data.IsPush=true
    //                ShareLink.update(data,{
    //                    where:{
    //                      ID:results.ID
    //                    }
    //                  }).then(s=>{
    //                          if(s[0]==1)
    //                          {
    //                              resolve(true)
    //                          }
    //                  })
    //             }

    //         let isRednet=false
    //         let domain=data.c_link.split('/')
    //         let _ArrData=[]
    //         if(_flag)//true：政府后台送来的 false:通过 添加页面送来的
    //         {
    //         console.log(`true：政府后台送来的`)
    //         console.log(`true：政府后台进来都会到此流程`)
    //             if(domain[2] =='daxiang.rednet.cn' || domain[2]=='daxiang-wap.rednet.cn' || domain[2]=='moment.rednet.cn')
    //             {
    //                 isRednet=true
    //                 _ArrRednet.forEach(v=>{
    //                     let _domain=data.c_link.split('/')
    //                         _domain[2]=v.key
    //                     let _clink=_domain.join('/')

    //                 let  _obj={
    //                         InputTimes:InputTimes,
    //                         c_PT:v.pt,
    //                         c_link:_clink,
    //                         shareTime:newdata,
    //                         C_videoUrl:data.C_videoUrl,
    //                         cameraman:data.cameraman,//摄影/摄像
    //                         newsman:data.newsman,//记者/通讯员
    //                         C_videoTimes:data.C_videoTimes,//视频时长
    //                         title: data.title,//稿件标题
    //                         c_auth: data.c_auth,//作者
    //                         c_Copyfrom: data.c_Copyfrom,//来源
    //                         c_status: data.c_status,//性质 原创/转发
    //                         c_type: data.c_type,//类型 图文/视频/H5/短视频/动漫
    //                         c_hit: data.c_hit,//点击量
    //                         sharer: data.sharer,   //发布者
    //                         C_hitGood: data.C_hitGood,//点赞量
    //                         C_comment: data.C_comment,//评论量
    //                         RednetID:data.RednetID,
    //                         IsPush:true
    //                     }
    //                 _ArrData.push(_obj)
    //                 })
    //             }
    //             else
    //             {
    //                 _ArrData.push(data)
    //             }
    //        }
    //        else
    //        {
    //            _ArrData.push(data)
    //        }
    //        ShareLink.bulkCreate(_ArrData).then(res=>{
    //         resolve(res.length>0)
    //     })
    //  })
  }
}

module.exports = ShareLinkClass;
