var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var cheerio = require("cheerio");


var moment = require("moment");
var charset = require("superagent-charset");
const { findUser } = require("../models/DXRM");
var superagent = charset(require("superagent"));
class ShareLinkClass {
  static GetrednetLive (data) {
    let opt = {
      url: data.url,
      LiveID: data.ID
    };
    return new Promise((resolve, reject) => {
      ShareLinkClass.ReturnProtocol(data)
        .get(opt.url + "?" + "liveid=" + opt.LiveID, function (res) {
          var html = ""; // 保存抓取到的 HTML 源码
          var movies = []; // 保存解析 HTML 后的数据，即我们需要的电影信息

          // 前面说过
          // res 是 Class: http.IncomingMessage 的一个实例
          // 而 http.IncomingMessage 实现了 stream.Readable 接口
          // 所以 http.IncomingMessage 也有 stream.Readable 的事件和方法
          // 比如 Event: 'data', Event: 'end', readable.setEncoding() 等

          // 设置编码
          res.setEncoding("utf-8");

          // 抓取页面内容
          res.on("data", function (chunk) {
            html += chunk;
          });

          res.on("end", function () {
            // 使用 cheerio 加载抓取到的 HTML 代码
            // 然后就可以使用 jQuery 的方法了
            // 比如获取某个 class：$('.className')
            // 这样就能获取所有这个 class 包含的内容
            var $ = cheerio.load(html);

            let body = html;
            console.log(body);
            resolve(body);
          });
        })
        .on("error", function (err) {
          console.log(err);
        });
    });
  }

  static getUrlParams (url) {
    return (url.split('?')[1] || "").split('&').reduce((ret, v) => {
      var kv = v.split('=');
      ret[kv[0]] = kv[1];
      return ret;
    }, {});
  }
  static getDate (strDate) {

    if (!strDate || strDate.indexOf("年") == 0) {
      return;
    }
    else {
      var st = strDate;
      var a = st.split("年");
      var year = a[0];
      var b = a[1].split("月");
      var month = b[0];
      var c = b[1].split("日");
      var day = c[0];
      // var year = strDate.split('')[0]+strDate.split('')[1]+strDate.split('')[2]+strDate.split('')[3];
      // var month = strDate.split('')[5]+strDate.split('')[6];
      // var day = strDate.split('')[08]+strDate.split('')[9];
      var _date =
        year + "-" + month + "-" + day + " " + "10" + ":" + "22" + ":" + "33";
      // var _date = new Date(year, month,day,' 00','00','00');
      // console.log(_date)
      let date = moment(_date).format("YYYY-MM-DD HH:mm:ss");
      console.log(date);
      return date;
    }
  }
  static ReturnProtocol (data) {

    return data.port == 80 ? http : https;
  }

  static formatImageTag (html, image) {
    return html.replace(/<!--\{img:(\d+)\}-->/ig, function (_, index) {
      var url = image[index] ? image[index].url : "";
      return '<div style="text-align: center;"><img src="' + url + '"></div>';
    });
  }
  static async Go (data) {
    //https://moment.rednet.cn/pc/content/2020/01/30/6663689.html

    let opt = {
      url: data.url
    };
    //let domain=ShareLinkClass.httpString(data.url);
    let _domain = data.url.split("/");

    //    let shorturl=ShareLinkClass.shorturl(data.url)
    //    console.log(shorturl)

    let _body = {
      title: "",
      video: "",
      author: "",
      source: "",
      publishdate: "",
      C_PT: "",
      c_Link: ""
    };

    //    console.log(ShareLinkClass.ReturnProtocol(data))
    return new Promise((resolve, reject) => {
      try {
        ShareLinkClass.ReturnProtocol(data)
          .get(opt.url, function (res) {
            var html = ""; // 保存抓取到的 HTML 源码
            var movies = []; // 保存解析 HTML 后的数据，即我们需要的电影信息
            let p;
            // 前面说过
            // res 是 Class: http.IncomingMessage 的一个实例
            // 而 http.IncomingMessage 实现了 stream.Readable 接口
            // 所以 http.IncomingMessage 也有 stream.Readable 的事件和方法
            // 比如 Event: 'data', Event: 'end', readable.setEncoding() 等
            // 设置编码
            res.setEncoding("utf-8"); //gbk //
            //res.setEncoding('gb2312');gbk 已经废除
            // 抓取页面内容
            res.on("data", function (chunk) {
              html += chunk;
            });
            res.on("end", async function () {
              // var decodeHtml = HtmlUtil.htmlDecode(html);

              var $ = cheerio.load(html, { decodeEntities: false }); //, { decodeEntities: false }
              let _url = "";

              switch (_domain[2]) {
                // https://c.m.163.com/news/a/FFDMJ85L04369EPL.html?spss=wap_refluxdl_2018&referFrom=&spssid=e8873313dbff2d6243a9144c12d2eb4a&spsw=3&isFromH5Share=article  
                //http://szb.shaoyangnews.net/syrb/html/2020-06/15/content_107128.htm
                case "baijiahao.baidu.com":
                  _body.C_PT = "百家号";
                  let myDate = new Date();
                  let tYear = myDate.getFullYear();
                  _body.title = tYear + ' ' + $('title').text();
                  console.log(_body.title);
                  _body.publishdate = $('.publishTime').text();

                  _body.content = $('.left-container').html();
                  break;
                case "mbd.baidu.com":
                  _body.C_PT = "百度新闻｜邵阳新闻网";
                  _body.title = '百度新闻｜' + $('title').text();
                  _body.content = $('.mainContent').html();
                  _body.publishdate = $('.publishTime').text();
                  console.log($('.mainContent').text());
                  break;
                case "wap.peopleapp.com": //华声在线
                  // let _string = $(".yi-normal > div span").text();
                  // let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/
                  _body.C_PT = "人民日报";
                  // _body.publishdate = ShareLinkClass.getDate($("title").text().split('_')[2]) || moment().format("YYYY-MM-DD HH:mm:ss");
                  // $("title").text().split('_')[2] //ShareLinkClass.getDate($("title").text().split('_')[2]); 
                  // _body.content = $("#ozoom").html();
                  // let peoplecontent = $(".article-wrapper").html();
                  // let imgUrl = $(".Ltd1 >img").attr("src").replace('../../../', '');
                  // let url = '<img width="400" src="http://szb.shaoyangnews.net/syrb/' + imgUrl + '"/>'
                  //https://app.peopleapp.com/WapApi/610/ArtInfoApi/getInfoUp?id=rmh15569652
                  _body.UrlType = 1
                  _body.c_type = '图文'
                  let peopleId = opt.url.split('/')[5];                 //  let auths=$('#ozoom').text();
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  p = new Promise((resolve, resject) => {
                    superagent.get('https://app.peopleapp.com/WapApi/610/ArtInfoApi/getInfoUp?id=' + peopleId)
                      .set('Accept', 'application/json')
                      .end((err, res) => {
                        let bodyContent = JSON.parse(res.text).data;
                        _body.content = bodyContent.contents
                        _body.title = '人民日报｜' + bodyContent.title
                        _body.publishdate = bodyContent.news_datetime
                        resolve(_body);
                      })
                  })
                  // https://app.peopleapp.com/WapApi/610/ArtInfoApi/getInfoUp?id=rmh15569652
                  //  console.log(auths)
                  // _body.author = !_arr ? "" : _arr[2];
                  // _body.source = "";
                  // _body.publishdate = !_arr ? "" : _arr[1];
                  // _body.video = $(".content > .description p img").attr(
                  //   "urlcloud"
                  // );
                  break;
                //http://paper.0739i.com.cn/Html/2020-9-11/18947.html
                case "paper.0739i.com.cn": //华声在线
                  // let _string = $(".yi-normal > div span").text();
                  // let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/
                  _body.C_PT = "邵阳城市报";
                  _body.title = '邵阳城市报｜' + $("title").text();

                  let paperimg = $('table').find('table').eq(6).find('img').eq(0).attr('src').replace('../../', '');//.find('img').get(2).outerHTML;
                  // $('table').find('table').eq(1).find('img').eq(2).outerHTML();
                  // $('table').eq(2).find('img').eq(3).attr('src').replace('../../../', '');
                  // let _flag = opt.url.replace(/(\?|&)from=[^&]*/, "")
                  // let flag = _flag.split('/')[1]
                  // console.log(flag)
                  // let _paperID = opt.url.split('/').pop();
                  // let paperID = _paperID.pop()
                  let paperimgdiv = '<img width="400" src="http://paper.0739i.com.cn/' + paperimg + '"/>'
                  p = new Promise((resolve, resject) => {
                    superagent.get(opt.url)
                      // .set('Accept', 'application/json')
                      .charset('gbk')
                      .end((err, res) => {
                        let paperHtml = res.text;
                        let $$ = cheerio.load(paperHtml);  // 采用cheerio模块解析html
                        // let paperContent = $$('table').find('tr').eq(0).find('table').eq(12).html()
                        let paperContent = $$('#div').html()
                        _body.content = paperimgdiv + paperContent;
                        _body.title = '邵阳城市报｜' + $$("title").text();
                        _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")
                        _body.c_type = "图文"
                        // _body.title = '人民日报｜' + bodyContent.title
                        // _body.publishdate = bodyContent.news_datetime
                        resolve(_body);
                      })
                  })
                  // _body.content = paperimgdiv;
                  // _body.publishdate = ShareLinkClass.getDate($("title").text().split('_')[2]) || moment().format("YYYY-MM-DD HH:mm:ss");
                  // // $("title").text().split('_')[2] //ShareLinkClass.getDate($("title").text().split('_')[2]); 
                  // // _body.content = $("#ozoom").html();
                  // let content = $("#ozoom").html();
                  // let imgUrl = $(".Ltd1 >img").attr("src").replace('../../../', '');
                  // let url = '<img width="400" src="http://szb.shaoyangnews.net/syrb/' + imgUrl + '"/>'
                  // _body.UrlType = 1
                  // _body.c_type = '图文'
                  // _body.content = url + content;                 //  let auths=$('#ozoom').text();


                  break;

                case "szb.shaoyangnews.net": //华声在线
                  // let _string = $(".yi-normal > div span").text();
                  // let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/
                  _body.C_PT = "邵阳日报";
                  _body.title = '邵阳日报｜' + $("title").text().split(' ')[0];
                  let _flag = opt.url.replace(/(\?|&)from=[^&]*/, "")
                  let flag = _flag.split('/')[1]
                  console.log(flag)

                  _body.publishdate = ShareLinkClass.getDate($("title").text().split('_')[2]) || moment().format("YYYY-MM-DD HH:mm:ss");
                  // $("title").text().split('_')[2] //ShareLinkClass.getDate($("title").text().split('_')[2]); 
                  // _body.content = $("#ozoom").html();
                  let content = $("#ozoom").html();
                  let imgUrl = $(".Ltd1 >img").attr("src").replace('../../../', '');
                  let url = '<img width="400" src="http://szb.shaoyangnews.net/syrb/' + imgUrl + '"/>'
                  _body.UrlType = 1
                  _body.c_type = '图文'
                  _body.content = url + content;                 //  let auths=$('#ozoom').text();
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  //  console.log(auths)
                  // _body.author = !_arr ? "" : _arr[2];
                  // _body.source = "";
                  // _body.publishdate = !_arr ? "" : _arr[1];
                  // _body.video = $(".content > .description p img").attr(
                  //   "urlcloud"
                  // );
                  break;
                case "c.m.163.com": //网易邵阳
                  // let _string = $(".yi-normal > div span").text();
                  // let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/
                  _body.C_PT = "网易邵阳";
                  _body.title = _body.C_PT + '｜' + $("title").text().split(' ')[0];
                  _body.publishdate = ShareLinkClass.getDate($("title").text().split('_')[2]) || moment().format("YYYY-MM-DD HH:mm:ss");
                  // $("title").text().split('_')[2] //ShareLinkClass.getDate($("title").text().split('_')[2]); 
                  _body.UrlType = 0
                  _body.content = $(".g-main-content").html();
                  //  let auths=$('#ozoom').text();
                  //  console.log(auths)
                  // _body.author = !_arr ? "" : _arr[2];
                  // _body.source = "";
                  // _body.publishdate = !_arr ? "" : _arr[1];
                  // _body.video = $(".content > .description p img").attr(
                  //   "urlcloud"
                  // );
                  break;

                //

                case "article.xuexi.cn": //学习强国
                  console.log(`学习`)
                  console.log(opt.url)
                  let params = ShareLinkClass.getUrlParams(opt.url)
                  let _content = ''
                  //  https://article.xuexi.cn/data/app/14439117134133209743.js?callback=callback
                  p = new Promise((resolve, resject) => {
                    superagent.get('https://article.xuexi.cn/data/app/' + params.art_id + '.js')
                      .charset("utf-8")
                      .end((err, res) => {

                        // stringObject.replace(regexp/substr,replacement)
                        let data = JSON.parse(res.text.replace(/^\s*callback\(([\s\S]+)\)\s*$/i, '$1'))


                        _body.content = ShareLinkClass.formatImageTag(data.content, data.image)
                        _body.C_PT = "学习强国"
                        _body.title = `学习强国｜${data.title}`
                        _body.publishdate = data.publish_time
                        _body.source = data.orig_source
                        _body.author = data.identity.creator_name
                        _body.description = data.identity.creator_name
                        _body.c_type = '图文'
                        _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                        resolve(_body);
                      })
                  })

                  // p = new Promise((resolve, resject) => {
                  //   superagent
                  //     .get(opt.url)
                  //     .charset("utf-8")
                  //     .end((err, res) => {

                  //       // console.log(res.text)
                  //       var $ = cheerio.load(res.text, {
                  //         decodeEntities: false
                  //       });
                  //       //  console.log(res.text)

                  //       _body.title = _body.C_PT + '｜' + $("title").text().split(' ')[0];

                  //       _body.C_PT = "学习强国";
                  //       _body.publishdate = ShareLinkClass.getDate($(".header-site-time").text()) || moment().format("YYYY-MM-DD HH:mm:ss");


                  //       _body.content = $("#xxqg-article-body")
                  //         .html()
                  //         .toString();
                  //       resolve(_body);
                  //     });
                  // });
                  // let _string = $(".yi-normal > div span").text();
                  // let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/
                  // _body.C_PT = "学习强国";
                  // _body.title = _body.C_PT + '｜' + $("title").text().split(' ')[0];
                  // _body.publishdate = ShareLinkClass.getDate($(".header-site-time").text()) || moment().format("YYYY-MM-DD HH:mm:ss");
                  // // $("title").text().split('_')[2] //ShareLinkClass.getDate($("title").text().split('_')[2]); 
                  // _body.UrlType = 0
                  // _body.content = $;



                  //  let auths=$('#ozoom').text();
                  //  console.log(auths)
                  // _body.author = !_arr ? "" : _arr[2];
                  // _body.source = "";
                  // _body.publishdate = !_arr ? "" : _arr[1];
                  // _body.video = $(".content > .description p img").attr(
                  //   "urlcloud"
                  // );
                  break;
                case "mp.weixin.qq.com": //大祥发布
                  _body.C_PT = "大祥发布";
                  let _InputTime = $("section")
                    .last()
                    .text();
                  _body.title = $('meta[property="og:title"]')
                    .attr("content")
                    .replace(/\s/g, "");
                  //    console.log('-----')
                  //    console.log(_InputTime.trim().replace(/\s/g,""))
                  //    console.log('-----')
                  if (!_InputTime == "" && _InputTime) {
                    let times = _InputTime.split("：");
                    _body.publishdate = ShareLinkClass.getDate(times[1]);
                  }

                  break;
                case "www.hunan.gov.cn": //大祥时刻
                  _body.C_PT = "湖南省门户网";
                  _body.title = $('meta[name="ArticleTitle"]').attr("content");
                  _body.description = $('meta[name="Description"]').attr(
                    "content"
                  );
                  _body.publishdate = $('meta[name="PubDate"]').attr("content");
                  _body.content = $("#zoom")
                    .html()
                    .toString();
                  break;
                case "moment.rednet.cn": //大祥时刻
                  _body.C_PT = "红网时刻";
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  _body.title = '红网时刻｜' + $("title")
                    .text()
                    .replace(/\s/g, "");
                  _body.c_type = "图文"

                  _body.content = $('.detail_article').html();
                  _body.author = $('meta[name="author"]').attr("content");
                  _body.source = $('meta[name="source"]').attr("content");
                  _body.description = $('meta[name="description"]').attr(
                    "content"
                  );
                  _body.publishdate = $('meta[name="publishdate"]').attr(
                    "content"
                  );
                  _body.video = $(".content > .description p img").attr(
                    "urlcloud"
                  );
                  break;
                case "daxiang-wap.rednet.cn": //大祥融媒
                  _body.C_PT = "大祥融媒";
                  _body.description = $('meta[name="description"]').attr(
                    "content"
                  );
                  _body.title = $("title")
                    .text()
                    .replace(/\s/g, "");
                  _body.author = $('meta[name="author"]').attr("content");
                  _body.source = $('meta[name="source"]').attr("content");
                  _body.publishdate = $('meta[name="publishdate"]').attr(
                    "content"
                  );
                  _body.video = $(".content > .description p img").attr(
                    "urlcloud"
                  );

                  break;
                case "daxiang.rednet.cn": //大祥新闻网
                  _body.C_PT = "大祥新闻网";
                  _body.title = $("title")
                    .text()
                    .replace(/\s/g, "");
                  _body.author = $('meta[name="author"]').attr("content");
                  _body.source = $('meta[name="source"]').attr("content");
                  _body.publishdate = $('meta[name="publishdate"]').attr(
                    "content"
                  );
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  _body.video = $(".content > .description p img").attr(
                    "urlcloud"
                  );
                  break;
                case "www.syxwnet.com": //邵阳新闻网
                  console.log(`1111111111111111`)
                  _body.title = '邵阳新闻网｜' + $('title').text().split('_')[0];
                  _body.C_PT = "邵阳新闻网";
                  _body.publishdate = $('.data').find('span').eq(2).text();
                  _body.author = $('.editors').text();
                  _body.source = '邵阳新闻网'
                  _body.content = $('.article-content').html().trim();
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")


                  break;
                case "wenku.baidu.com":
                  p = new Promise((resolve, resject) => {
                    superagent.get('https://wkbjcloudbos.bdimg.com/v1/docconvert2986/wk/6bf913765c86833e89bde9883dde37ce/0.json?responseContentType=application%2Fjavascript&responseCacheControl=max-age%3D3888000&responseExpires=Thu%2C%2022%20Oct%202020%2009%3A46%3A00%20%2B0800&authorization=bce-auth-v1%2Ffa1126e91489401fa7cc85045ce7179e%2F2020-09-07T01%3A46%3A00Z%2F3600%2Fhost%2Fdf0d90a17f314fd4da20c37794b272db3054206c86c34c9b08b551bd5327c3e3&x-bce-range=0-12833&token=eyJ0eXAiOiJKSVQiLCJ2ZXIiOiIxLjAiLCJhbGciOiJIUzI1NiIsImV4cCI6MTU5OTQ0Njc2MCwidXJpIjp0cnVlLCJwYXJhbXMiOlsicmVzcG9uc2VDb250ZW50VHlwZSIsInJlc3BvbnNlQ2FjaGVDb250cm9sIiwicmVzcG9uc2VFeHBpcmVzIiwieC1iY2UtcmFuZ2UiXX0%3D.rbtrhr6ZyhUGGlFJUOqFUeSePmHQw3zdKt3NZLX8UP8%3D.1599446760')
                      .set('Accept', 'application/json')
                      .end((err, res) => {
                        console.log(res)
                        let wenkubodyContent = res.body
                        _body.content = wenkubodyContent
                        _body.c_Link = opt.url;
                        // _body.title = '人民日报｜' + bodyContent.title
                        // _body.publishdate = bodyContent.news_datetime
                        resolve(_body);
                      })
                  })
                  // let baiducontent = $('reader-container').text();
                  // _body.content = baiducontent
                  break;
                case "sy.voc.com.cn": //华声在线
                  let _string = $(".yi-normal > div span").text();
                  let _arr = _string.match(/([\d \-\:]+).*作者：([^\(]+)/); ///([\d \:]+).*作者：([^(]+)/

                  _body.C_PT = "华声在线邵阳频道";
                  _body.title = '华声在线｜' + $(".yi-normal > span").text();
                  _body.author = !_arr ? "" : _arr[2];
                  _body.source = "";
                  _body.publishdate = !_arr ? "" : _arr[1];
                  let syvocContent = $('.yi-normal').find('div').eq(1).html();
                  let syvocimglist = syvocContent.match(/<img\b.*?(?:\>|\/>)/gi)
                  let syvocimgarr = []
                  syvocimglist.forEach(item => {
                    syvocimgarr.push('http://sy.voc.com.cn' + item.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[1]);
                  });
                  _body.c_type = '图文'
                  let syvocarr = []
                  _body.content = syvocContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture, index) {
                    syvocarr.push(index)
                    if (syvocarr.length > 0) {
                      let newStr = '<p style="text-align: center;"><img width="800" src="' + syvocimgarr[syvocarr.length - 1] + '" alt="" /></p>';
                      return newStr
                    }
                    return '';
                  })

                  _body.video = $(".content > .description p img").attr(
                    "urlcloud"
                  );
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  break;
                case "m.voc.com.cn": //新湖南
                  // var $ = cheerio.load( html , { decodeEntities: false });
                  console.log(`----------------------`); //function (err, res)
                  p = new Promise((resolve, resject) => {
                    superagent
                      .get(opt.url)
                      .charset("utf-8")
                      .end((err, res) => {
                        // console.log(res.text)
                        var $ = cheerio.load(res.text, {
                          decodeEntities: false
                        });
                        //  console.log(res.text)
                        let _string2 = $("title")
                          .text()
                          .replace(/\s/g, "");
                        _body.title = '新湖南｜' + _string2;
                        _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                        _body.video = "999";
                        _body.C_PT = "新湖南";
                        _body.publishdate = $("#content_time").text();
                        _body.description = $('meta[name="description"]').attr(
                          "content"
                        );
                        _body.keywords = $('meta[name="keywords"]').attr(
                          "content"
                        );
                        _body.content = $("#content")
                          .html()
                          .toString();
                        resolve(_body);
                      });
                  });
                  break;
                case "hunan.voc.com.cn": //华声在线
                  // var $ = cheerio.load( html , { decodeEntities: false });
                  console.log(`----------------------`); //function (err, res)
                  p = new Promise((resolve, resject) => {
                    superagent
                      .get(opt.url)
                      .charset("utf-8")
                      .end((err, res) => {
                        // console.log(res.text)
                        var $ = cheerio.load(res.text, {
                          decodeEntities: false
                        });
                        //  console.log(res.text)
                        let _string2 = $("title")
                          .text()
                          .replace(/\s/g, "");
                        _body.title = _string2;
                        _body.video = $("video").attr("src");
                        _body.C_PT = "华声在线";
                        _body.publishdate = $("#news-time").text();
                        _body.description = $('meta[name="description"]').attr(
                          "content"
                        );
                        _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                        _body.keywords = $('meta[name="keywords"]').attr(
                          "content"
                        );
                        _body.content = "";
                        console.log(_body);
                        resolve(_body);
                      });
                  });
                  break;
                case "mgynew.hntvcloud.com": //芒果云新闻客户端
                  _body.content = $("#app")
                    .html()
                    .toString();

                  _body.C_PT = "芒果云";
                  //  _body.title=$("title").text().replace(/\s/g,"");
                  //  _body.author= $('meta[name="author"]').attr('content')
                  //  _body.source=a[1]
                  //  _body.publishdate=ShareLinkClass.getDate($('meta[name="publishdate"]').attr('content'))
                  _body.video = $("video > source").attr("src");
                  break;

                //https://mgynew.hntvcloud.com

                case "www.toutiao.com": //今日头条
                  _body.C_PT = "今日头条";
                  _body.title = "";
                  _body.author = "";
                  _body.source = "";
                  _body.publishdate = "";
                  _body.video = "";
                  _url = data.url.split("?")[0];
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  console.log(data);
                  //   _url=data.url.split('?')[0]
                  //   _body.c_Link=_url
                  break;
                case "m.toutiaocdn.com": //今日头条手机
                  _body.C_PT = "今日头条";
                  _body.title = "";
                  _body.author = "";
                  _body.source = "";
                  _body.publishdate = "";
                  _body.video = "";
                  console.log(data.url.split("?")[0]);
                  _url = data.url.split("?")[0];
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  break;
                case "www.dxzc.gov.cn": //大祥之窗
                  let s = $(".ly2")
                    .children("span")
                    .eq(0)
                    .text();
                  let _a = $(".ly2")
                    .children("span")
                    .eq(2)
                    .text()
                    .replace(/\s/g, ""); //InputTime=ShareLinkClass.getDate(times[1])
                  let a = _a.split(":");
                  let _time = s.split(":");
                  let time = ShareLinkClass.getDate(_time[1]);
                  _body.C_PT = "大祥之窗";
                  _body.title = $("title")
                    .text()
                    .replace(/\s/g, "");
                  _body.author = $('meta[name="author"]').attr("content");
                  _body.source = a[1];
                  _body.publishdate = ShareLinkClass.getDate(
                    $('meta[name="publishdate"]').attr("content")
                  );
                  _body.video = $(".content > .description p img").attr(
                    "urlcloud"
                  );
                  break;

                case "m.chinajiceng.com.cn": //y
                  // let s= $('.ly2').children("span").eq(0).text();
                  // let _a= $('.ly2').children("span").eq(2).text().replace(/\s/g,"");   //InputTime=ShareLinkClass.getDate(times[1])
                  // let a=_a.split(':')
                  // let _time=s.split(':')
                  // let time= ShareLinkClass.getDate(_time[1])
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  _body.C_PT = "中国基层网";
                  _body.title = '中国基层网｜' + $(".title")
                    .text()
                    .replace(/\s/g, "");
                  _body.author = $('meta[name="author"]').attr("content");
                  _body.keywords = $('meta[name="keywords"]').attr("content");
                  _body.description = $('meta[name="description"]').attr("content");
                  _body.c_type = "图文"
                  let jicengcontent = $("#content").html();
                  let syimglist = jicengcontent.match(/<img\b.*?(?:\>|\/>)/gi)
                  var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                  let imgarr = []
                  syimglist.forEach(item => {
                    let s = item.match(srcReg)[1];
                    imgarr.push(s);
                  });
                  let ss = $(".info")
                    .text()
                  // .replace(/\s/g, "");
                  let times = ss.split("|")[1];
                  //news_detail_time ng-binding
                  _body.publishdate = times;
                  let jicengaarr = []
                  _body.content = jicengcontent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture, index) {
                    jicengaarr.push(index)

                    if (jicengaarr.length > 0) {
                      let newStr = '<p style="text-align: center;"><img width="800" src="http://m.chinajiceng.com.cn/' + imgarr[jicengaarr.length - 1] + '" alt="" /></p>';
                      return newStr
                    }
                    return '';
                  })
                  //  $("#content").html();
                  break;
                case "h5.newaircloud.com": //y
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")
                  _body.title = '云邵阳｜' + $('title').text();
                  _body.description = $('meta[name="description"]').attr("content");
                  _body.C_PT = "云邵阳"; //
                  _body.source = "云邵阳";
                  let newaircloudcontent = $('#article-content').html();
                  // let syimglist = newaircloudcontent.match(/<img\b.*?(?:\>|\/>)/gi)

                  let syimglisturl = newaircloudcontent.match(/data-original=[\'\"]?([^\'\"]*)[\'\"]?/gi)
                  let newimglist = []
                  syimglisturl.forEach(item => {
                    let aa = item.replace(/data-original="(.+)"/, '$1')
                    newimglist.push(aa);
                  });

                  let aarr = []
                  _body.content = newaircloudcontent.replace(/<img [^>]*_src=['"]([^'"]+)[^>]*>/gi, function (match, capture, index) {
                    aarr.push(index)

                    if (aarr.length > 0) {
                      let newStr = '<p style="text-align: center;"><img width="800" src="https://images.weserv.nl/?url=' + newimglist[aarr.length - 1] + '" alt="" /></p>';
                      return newStr
                    }
                    return '';
                  })
                  // _body.content = syimglist
                  _body.publishdate = $(".news_detail_meta").find('span').eq(2).text();
                  _body.c_type = '图文'
                  _body.author = ''
                  // let urlparams = $(".news_detail_meta").find('span').eq(2).text();
                  // let yearparam = urlparams.split('-')[0] + urlparams.split('-')[1]
                  // var id = ((opt.url.match(/\/\d+(?=_)/) || [""])[0]).slice(1);
                  // let date = urlparams.split('-')[2]
                  // let apiurl = 'https://syrboss.newaircloud.com/syrb/article/' + yearparam + '/' + date.split(' ')[0] + '/c' + id + '.json'
                  // p = new Promise((resolve, resject) => {
                  //   superagent.get(apiurl)
                  //     .charset("utf-8")
                  //     .type('application/json')
                  //     .end((err, res) => {
                  //       let _content = res.text.replace('var gArticleJson = ', '').trim();

                  //       _body.content = _content.replace(/,\s*(\}\])/g, '$1')
                  //       resolve(_body);
                  //     })
                  // })
                  // stringObject.replace(regexp/substr,replacement)
                  // let data = JSON.parse(res.text.replace(/^\s*callback\(([\s\S]+)\)\s*$/i, '$1'))


                  // _body.content = ShareLinkClass.formatImageTag(data.content, data.image)
                  // _body.C_PT = "学习强国"
                  // _body.title = `学习强国｜${data.title}`
                  // _body.publishdate = data.publish_time
                  // _body.source = data.orig_source
                  // _body.author = data.identity.creator_name
                  // _body.description = data.identity.creator_name
                  // _body.c_type = '图文'
                  // _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")


                  // let s= $('.ly2').children("span").eq(0).text();
                  // let _a= $('.ly2').children("span").eq(2).text().replace(/\s/g,"");   //InputTime=ShareLinkClass.getDate(times[1])
                  // let a=_a.split(':')
                  // let _time=s.split(':')
                  // let time= ShareLinkClass.getDate(_time[1])
                  // _body.C_PT = "云邵阳";
                  // //https://syrboss.newaircloud.com/syrb/article/202007/30/c13350208.json?version=1596099875
                  // // src="https://images.weserv.nl/?url=syrboss.newaircloud.com/syrb/upload/202007/30/sf--d25--2f18d28c114d131923f18cfe_batchwm.jpg"
                  // //"2020-07-30 16:13:34"
                  // //https://h5.newaircloud.com/detailArticle/13350208_26045_syrb.html?source=1
                  // _body.title = $("title")
                  //   .text()
                  //   .replace(/\s/g, "");
                  // _body.author = $('meta[name="author"]').attr("content");
                  // _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  // //news_detail_time ng-binding
                  // _body.publishdate = $(".news_detail_time")
                  //   .text()
                  //   .replace(/\s/g, "");
                  // let urlparams = $(".news_detail_meta").find('span').eq(2).text();
                  // let yearparam = urlparams.split('-')[0] + urlparams.split('-')[1]
                  // var id = ((opt.url.match(/\/\d+(?=_)/) || [""])[0]).slice(1);
                  // let date = urlparams.split('-')[2]
                  // let apiurl = 'https://syrboss.newaircloud.com/syrb/article/' + yearparam + '/' + date.split(' ')[0] + '/c' + id + '.json'
                  // // _body.publishdate = paramid;
                  // _body.content = apiurl
                  // _body.content = $("#article-content")
                  //   .html();

                  break;

                //    http://sy.voc.com.cn/m/view.php?tid=59254&cid=7
                case "hnrb.voc.com.cn": //湖南日报数字版
                  _body.C_PT = "湖南日报"; //
                  _body.title = '湖南日报｜' + $("title")
                    .text()
                    .replace(/-{3,}[\s\S]+/, "");
                  let _data = $(".default")
                    .text()
                    .replace(/\s/g, "");
                  let _arr2 = _data.split("日");
                  let hnrbcontent = $("#ozoom").html();
                  // let hnrbimgUrl = $("table");
                  // let hnrbimgUrl = $("table tr").eq(1).$("td").attr("src").replace('../../../', '');
                  // let hnrbimgUrl = $("table tr td img").attr("src").replace('../../../', '');

                  let hnrbimgUrl = $('table').eq(2).find('img').eq(3).attr('src').replace('../../../', '');
                  let urldiv = '<img width="400" src="http://hnrb.voc.com.cn/hnrb_epaper/' + hnrbimgUrl + '"/>'
                  _body.publishdate = ShareLinkClass.getDate(_arr2[0] + "日");
                  _body.content = urldiv + hnrbcontent
                  _body.c_type = '图文'
                  _body.author = "";
                  _body.source = "湖南日报";
                  _body.c_Link = opt.url.replace(/(\?|&)from=[^&]*/, "")

                  //     let s= $('.ly2').children("span").eq(0).text();
                  //     let _a= $('.ly2').children("span").eq(2).text().replace(/\s/g,"");   //InputTime=ShareLinkClass.getDate(times[1])
                  //     let a=_a.split(':')
                  //     let _time=s.split(':')
                  //     let time= ShareLinkClass.getDate(_time[1])
                  //     _body.C_PT="湖南日报数字版"
                  //     _body.title=$("title").text().replace(/\s/g,"");
                  //     _body.author= $('meta[name="author"]').attr('content')
                  //     _body.source=a[1]
                  //    default
                  //     console.log(time)
                  //     _body.publishdate=ShareLinkClass.getDate($('meta[name="publishdate"]').attr('content'))
                  //     _body.video=$('.content > .description p img').attr('urlcloud')
                  break;
                default:
                  break;
              }

              if (p) {
                _body = await p;
              }

              let body = {
                _body
              };
              resolve(body);

              // 保存抓取到的电影数据
              // saveData('data/data.json', movies);
            });
          })
          .on("error", function (err) {
            console.log(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = ShareLinkClass;



// <html xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"/><meta name="referrer" content="always"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"><link rel="shortcut icon" href="https://gss0.bdstatic.com/5bd1bjqh_Q23odCf/static/wiseindex/img/favicon64.ico" type="image/x-icon"><link rel="apple-touch-icon-precomposed" href="https://gss0.bdstatic.com/5bd1bjqh_Q23odCf/static/wiseindex/img/screen_icon_new.png"><title>「“廉洁单位”创建书记谈第十二期」黄艳娥：打造廉洁亮丽名片 推动大祥高质量发展</title><link rel="stylesheet" href="https://mbdp01.bdstatic.com/static/superlanding/css/land_min_pack_7b3c641.css"><meta itemprop="dateUpdate" content="2020-10-10 00:17:05" /></head><body><script >/* eslint-disable */var s_domain = {"protocol":"https:","staticUrl":"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/","base":"","baseuri":"","passconf":"http://passport.baidu.com/ubrwsbas","logout":"https://passport.baidu.com/?logout&u=","bs":"https://www.baidu.com","sp":"http://hi.baidu.com/","ssllist":{"a.hiphotos.baidu.com":"ss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy","b.hiphotos.baidu.com":"ss1.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy","c.hiphotos.baidu.com":"ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy","d.hiphotos.baidu.com":"ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy","e.hiphotos.baidu.com":"ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy","f.hiphotos.baidu.com":"ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy","g.hiphotos.baidu.com":"ss3.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy","h.hiphotos.baidu.com":"ss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy","1.su.bdimg.com":"ss0.bdstatic.com/k4oZeXSm1A5BphGlnYG","t10.baidu.com":"ss0.baidu.com/6ONWsjip0QIZ8tyhnq","t11.baidu.com":"ss1.baidu.com/6ONXsjip0QIZ8tyhnq","t12.baidu.com":"ss2.baidu.com/6ONYsjip0QIZ8tyhnq","himg.bdimg.com":"ss1.bdstatic.com/7Ls0a8Sm1A5BphGlnYG","cdn00.baidu-img.cn":"ss0.bdstatic.com/9bA1vGba2gU2pMbfm9GUKT-w","cdn01.baidu-img.cn":"ss0.bdstatic.com/9bA1vGfa2gU2pMbfm9GUKT-w"}};var s_session = {"ssid":"0","logid":"","sid":"148078_153758_155442_150967_156818_156289_150775_154258_148867_156098_154605_157760_153716_156623_157263_153065_131862_154173_156417_156387_158258_157961_156515_127969_154175_155963_152982_155803_146732_156246_131423_154037_107318_154189_156945_155344_157024_158022_157171_158615_157792_144966_157401_154214_157814_158638_155530_156725_154144_147551_158368_151538_157696_154639_154346_110085_157006","nid":"9830719775847362406","qid":""};var s_advert = {"isBjh":"1","contentUrl":"http://baijiahao.baidu.com/s?id=1680091978142694617","contentPlatformId":"3","contentType":"1","pvid":"c8b814c9cc4d5ee6","time":"2020-10-13 09:34:51","contentAccType":"1","ctk":"00a3f69da2bfa2c8","contentAccId":"iSFlTIjsSdiW2qIR6IMy_A","ctk_b":"7b0e623192d67128","logid":"2091734293","dtime":"1602552891","grade":"1","createTimeAccLevel":"2"};</script><script>/* eslint-disable */var bds={se:{},su:{urdata:[],urSendClick:function(){},urStatic:"https://ss.bdimg.com"},util:{},use:{},comm:{domain:"",ubsurl:"",tn:"",queryEnc:"",queryId:"",inter:"",sugHost:"",query:"",qid:"",cid:"",sid:"",stoken:"",serverTime:"",user:"",username:"",loginAction:[],useFavo:"",pinyin:"",favoOn:"",curResultNum:"0",rightResultExist:false,protectNum:0,zxlNum:0,pageNum:1,pageSize:10,ishome:1,newindex:1}};var name,navigate,al_arr=[];var selfOpen=window.open;eval("var open = selfOpen;");var isIE=navigator.userAgent.indexOf("MSIE")!=-1&&!window.opera;var E=bds.ecom={};bds.se.mon={loadedItems:[],load:function(){},srvt:-1};try{bds.se.mon.srvt=parseInt(document.cookie.match(new RegExp("(^| )BDSVRTM=([^;]*)(;|$)"))[2]);document.cookie="BDSVRTM=;expires=Sat, 01 Jan 2000 00:00:00 GMT"}catch(e){}var bdUser=bds.comm.user?bds.comm.user:null,bdQuery=bds.comm.query,bdUseFavo=bds.comm.useFavo,bdFavoOn=bds.comm.favoOn,bdCid=bds.comm.cid,bdSid=bds.comm.sid,bdServerTime=bds.comm.serverTime,bdQid=bds.comm.queryId,bdstoken=bds.comm.stoken,login_success=[];</script><div id="detail-page"><div class="line-shadow"></div><div class="item-wrap"><div id="header_wrap" class="header_wrap"><div class="header_content"><div class="header_logo"><a href="https://www.baidu.com" id="result_logo" data-clklog="tid:139;cst:2;logInfo:head_logo;" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;" data-rid="head_0"><img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superlanding/img/logo_top.png" alt="到百度首页" title="到百度首页"></a></div><div class="header_menu" data-rid="header_menu"><a href="https://www.baidu.com" class="index" data-clklog="tid:142;cst:2;logInfo:head_menu" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;type:backindex" data-rid="head_1">百度首页</a><span class="line"></span><div id="userBlock"><a href="https://passport.baidu.com/v2/?login&tpl=mn&u=http://www.baidu.com" class="login" data-clklog="tid:142;cst:2;logInfo:head_menu;" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;type:login" data-rid="head_2">登录</a><a href="http://i.baidu.com/" id="usrname" class="usrname" data-clklog="tid:142;cst:2;logInfo:head_menu;" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;type:usrname;" data-rid="head_2"><span id="nametxt"></span><div id="user_menu" data-showlog="tid:131;cst:1;logInfo:usrmenu;" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;" class="s-isindex-wrap s-user-set-menu menu-top" style="display: none;"><div><a href="http://i.baidu.com/center" target="_blank" data-tid="1000" data-clklog="tid:146;cst:2;logInfo:usrmenu;" data-extralog="rid:;pos:1;extra:;isBaiJiaHao:1;login:0;type:center;" data-rid="usr_menu_1">个人中心</a><a href="http://passport.baidu.com/" data-tid="1001" target="_blank" data-clklog="tid:146;cst:2;logInfo:usrmenu;" data-extralog="rid:;pos:2;extra:;isBaiJiaHao:1;login:0;type:passport;" data-rid="usr_menu_2">帐号设置</a><a class="s-feedback" style="overflow:hidden" href="#" onclick="return false;" data-clklog="tid:146;cst:2;logInfo:usrmenu;" data-extralog="rid:;pos:3;extra:;isBaiJiaHao:1;login:0;type:feedback;" data-rid="header_menu_3">意见反馈</a><a class="quit" style="overflow:hidden" href="https://passport.baidu.com/?logout&u=https://www.baidu.com" data-clklog="tid:146;cst:2;logInfo:usrmenu;" data-extralog="rid:;pos:4;extra:;isBaiJiaHao:1;login:0;type:quit;" data-rid="usr_menu_4">退出</a></div><span class="menu-arrow"><em></em></span></div></div></div></div></div></div><div class="title_border"><div class="anci_header_content"><div class="article-title"><h2>「“廉洁单位”创建书记谈第十二期」黄艳娥：打造廉洁亮丽名片 推动大祥高质量发展</h2></div><div class="article-desc clearfix"><div class="author-icon"><img src="https://pic.rmb.bdstatic.com/bjh/user/2b8c89bba3e0dcf633035d5892d89cfc.jpeg"><i class="author-vip author-vip-2"></i></div><div class="author-txt"><p class="author-name">湖南24小时</p><div class="article-source article-source-bjh"><span class="date">发布时间：10-10</span><span class="time">00:17</span><span class="account-authentication">湖南热点新闻官方帐号</span></div></div></div></div></div><div id="content-container" class="content-container clearfix" data-showlog="tid:126;cst:1;logInfo:landing;" data-extralog="flow:2;st:news;rid:9830719775847362406;pos:0;extra:;source:1;isBaijiahao:1;login:0;appId:1671002953130924;" data-ratio="1" data-rid="page"><div id="left-container" class="left-container"><div class="item-wrap"><div class="article " id="article" data-islow-browser="0"><div class="article-content"><div class="img-container video-container" data-rid="mda-kj90j4ty4vmuzt70" data-showlog="tid:950;cst:1;ct:2;logInfo:main_video;" data-extralog="rid:9830719775847362406;vid:mda-kj90j4ty4vmuzt70;"><video style="display:block; height:100%;" class="video-player" x-webkit-airplay="allow" preload="none" poster="https://timg01.bdimg.com/timg?pacompress&amp;imgtype=0&amp;sec=1439619614&amp;autorotate=1&amp;di=3a0a94290059fcf8124a142e763318ee&amp;quality=90&amp;size=b1920_1080&amp;src=http%3A%2F%2Fvd3.bdstatic.com%2Fmda-kj90j4ty4vmuzt70%2Fmda-kj90j4ty4vmuzt70.jpg" src="https://vd3.bdstatic.com/mda-kj90j4ty4vmuzt70/mda-kj90j4ty4vmuzt70.mp4?playlist=%5B%22hd%22%2C%22sc%22%5D"></video><div class="video-icon no-length-icon"></div><div class="video-time-length">04:30</div></div><p>打造廉洁亮丽名片 推动大祥高质量发展</p><p>——专访大祥区委书记黄艳娥</p><div class="img-container"><img class="large" data-loadfunc=0 src="https://pics1.baidu.com/feed/5d6034a85edf8db1b698b102c87bb553574e7486.png?token=3a05660badaa187c21aa0efea05deb3e&amp;s=3DADDB1679E21F26409A62A30300A00B" data-loaded=0 /></div><p><span class="bjh-p">“大祥区以‘廉洁单位’创建活动为载体，进一步改进干部作风、提升单位形象、净化政治生态，推动廉洁思想、廉洁制度、廉洁纪律、廉洁文化融入政治、经济、文化、社会和生态文明建设中，全力打造‘廉洁大祥’亮丽名片，推动全区各项工作高质量发展。”日前，大祥区委书记黄艳娥在接受采访时说道。</span></p><p><span class="bjh-p">自开展“廉洁单位”创建活动以来，大祥区结合实际，专门印发《关于落实市委“五项”“六创”、区委“九大”重点工作的实施意见》，将“廉洁单位”创建作为落实市委“六创”之一纳入全区重点工作。先后开展蹲点调研、“强化意识形态责任、狠抓干部作风建设”、落实中央八项规定精神问题整改情况“回头看”，以及巡视巡察问题整改情况“回头看”等活动，助推“廉洁单位”创建向纵深发展。</span></p><p><span class="bjh-p">黄艳娥介绍，大祥区针对区直机关、乡镇（街道）、村（社区）、医院、学校等工作实际，分别出台了创建考核评估办法，把创建“廉洁单位”作为创建“文明单位”的前置条件，并将“廉洁单位”纳入绩效考核体系，与考核评优相挂钩。此外，区创廉办还建立了工作联系指导制度，加强指导，压紧压实创廉工作的主体责任，进一步增强创廉工作的科学性、操作性和实效性。</span></p><p><span class="bjh-p">为营造“廉洁单位”创建的浓厚氛围，一方面全区各单位通过设立廉政文化宣传专栏、标语等方式开展宣传，提升干部知晓度、参与度。另一方面坚持以案为镜为鉴为戒为训，以身边的典型案例为教材，从提高干部职工的底线意识、红线意识出发，筑牢“不敢腐、不能腐、不想腐”的思想防线。 “区创廉办编印发放了《创建‘廉洁单位’宣传手册》8000多份，同时广泛宣传创建‘廉洁单位’活动的好经验好做法。其中，《邵阳市大祥区：特色‘创廉’育新风》还被学习强国平台收录推送。”黄艳娥说道。</span></p><p><span class="bjh-p">分级分类创建，积极打造自身创建品牌，是大祥区开展“廉洁单位”创建活动的一大特色和亮点。该区纪委监委联合区妇联，围绕“发出一份倡议、作出一个承诺、推出一场展览、开展一次警示、组织一场朗诵”等“五个一”开展活动，强化廉洁家风建设；区住建局打造“廉文化+老旧小区改造”组合，在改造老旧小区的同时，设立廉政文化墙，让廉政文化宣传工作走深走实；雨溪社区着力打造廉政文化示范点，以点带面，成风化人；大祥一中设置廉洁文化教育长廊，开辟“廉洁教育专栏”……各创建单位在探索实践中做好结合文章，创新工作举措，推动工作取得较好成效。</span></p><p><span class="bjh-p">黄艳娥说， 创建“廉洁单位”，要发挥它的创建引领和基础性作用，促进各级各单位坚决落实中央及省市区委的决策部署，推动各项工作落实落细落地。“廉洁单位”创建成功与否、成效好坏，不仅要看创建工作举措有多少，更要看有没有推动工作，取得成效。下一步，大祥区将进一步压实主体责任，做好结合文章，打造特色亮点，建立长效机制，让“廉洁大祥”成为一张闪亮名片。同时，进一步注重将创廉工作和业务工作相结合，开展常态化廉洁文化建设、经常性警示教育，让廉洁思想、廉洁文化、廉洁纪律潜移默化地深入人心，真正让廉洁成为一种生产力、一种自觉行动，成为党员干部的工作生活习惯和干事创业的充盈正气。（陈湘林 罗俊）</span></p><p><span class="bjh-p">策划：市纪委监委、市委宣传部</span></p><p><span class="bjh-p">文稿：邵阳日报</span></p><p><span class="bjh-p">视频：邵阳广播电视台</span></p><p>编辑：陈湘林</p><p>审核：彭茂华</p><p><span class="bjh-p">清廉邵阳</span></p><p><span class="bjh-p">【来源：清廉邵阳】</span></p><p><span class="bjh-p">声明：转载此文是出于传递更多信息之目的。若有来源标注错误或侵犯了您的合法权益，请作者持权属证明与本网联系，我们将及时更正、删除，谢谢。 邮箱地址：newmedia@xxcb.cn</span></p></div><audio height="0" width="0" id="musicAudio" data-play-index><source></source></audio></div></div><button class="report-container" id="feedback_report(215939)">举报/反馈</button></div><div id="right-container" class="right-container"><div class="item-wrap"><div class="recent-article" data-pos=""><h2>作者最新文章</h><ul><li data-showlog="tid:135;cst:1;logInfo:recent_article;" data-extralog="rid:;pos:0;extra:;isBaiJiaHao:1;login:0;"  data-rid="recent_article_0"><h3 class="item-title"><a href="https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9597342772014127708%22%7D&amp;n_type=1&amp;p_from=3" data-clklog="tid:147;cst:2;logInfo:recent_article;" data-extralog="rid:;pos:0;extra:;isBaiJiaHao:1;login:0;" target="_blank">《金刚川》10月25日上映，张译吴京李九霄魏晨奋勇迎战</a></h3><div class="item-desc hide"><span class="info-date">10-13</span><span class="info-time">09:05</span></div></li><li data-showlog="tid:135;cst:1;logInfo:recent_article;" data-extralog="rid:;pos:1;extra:;isBaiJiaHao:1;login:0;"  data-rid="recent_article_1"><h3 class="item-title"><a href="https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9908898123496473146%22%7D&amp;n_type=1&amp;p_from=3" data-clklog="tid:147;cst:2;logInfo:recent_article;" data-extralog="rid:;pos:1;extra:;isBaiJiaHao:1;login:0;" target="_blank">外贸促稳提质 深圳1-8月进出口总值达到1.88万亿元</a></h3><div class="item-desc hide"><span class="info-date">10-13</span><span class="info-time">09:02</span></div></li><li data-showlog="tid:135;cst:1;logInfo:recent_article;" data-extralog="rid:;pos:2;extra:;isBaiJiaHao:1;login:0;"  data-rid="recent_article_2"><h3 class="item-title"><a href="https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_10337737315190631660%22%7D&amp;n_type=1&amp;p_from=3" data-clklog="tid:147;cst:2;logInfo:recent_article;" data-extralog="rid:;pos:2;extra:;isBaiJiaHao:1;login:0;" target="_blank">央地政策频出智能制造升级再添引擎 企业加码布局</a></h3><div class="item-desc hide"><span class="info-date">10-13</span><span class="info-time">09:01</span></div></li></ul></div></div><div class="item-wrap"><div class="related-news"><div class="news-content "><h2>相关文章</h2><ul><li data-showlog="tid:136;cst:1;logInfo:related_news;" data-extralog="flow:2;rid:;pos:0;extra:;isBaiJiaHao:1;login:0;"  data-rid="related_news_0"><div class="item-content clearfix"><div class="news-info"><div class="news-title"><h3><a class="upgrade" data-clklog="tid:148;cst:2;logInfo:related_news;" data-extralog="rid:;pos:0;extra:;isBaiJiaHao:1;login:0;type:'title'"  href="https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9868915594202679609%22%7D&amp;n_type=1&amp;p_from=4" target="_blank">聂卫平柯洁惊喜亮相《舍我其谁》筹备特辑</a></h3></div></div><div class="news-pic"><a class="upgrade" data-clklog="tid:148;cst:2;logInfo:related_news;" data-extralog="rid:;pos:1;extra:;isBaiJiaHao:1;login:0;type:'img'" href="https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_9868915594202679609%22%7D&amp;n_type=1&amp;p_from=4" target="_blank"><img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2872836602,2729647251&amp;fm=173&amp;app=49&amp;f=JPEG?w=312&amp;h=208&amp;s=B0175F905EE35A847815D8C0030030E3"></a></div></div></li></ul></div></div><div id="relateAd" ad-id="relate-js" class="wangmeng-ad" data-showlog="tid:369;cst:1;logInfo:adsjs;" data-clklog="tid:370;cst:2;logInfo:adsjs;" data-extralog="rid:;pos:1;extra:;baijiahao:1;login:0;"></div></div></div></div><div id="bottom-container" class="bottom-container "><div class="copy-right"><div class="baidu-info"><a class="sethome" href="//www.baidu.com/cache/sethelp/index.html" target="_blank"><span>设为首页</span></a><span class="copyright-text"><span>&#169;&nbsp;Baidu&nbsp;</span><a href="//www.baidu.com/duty/" target="_blank">使用百度前必读</a>&nbsp;<a href="http://jianyi.baidu.com" target="_blank">意见反馈</a>&nbsp;<span>京ICP证030173号&nbsp;</span><img width=13 height=16 src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/copy_rignt_24.png" /></span></div><div class="recordcode"><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002000001"  target="_blank"><i></i>京公网安备11000002000001号</a></div></div><div class="back-to-top" data-showlog="tid:133;cst:1;logInfo:back_to_top;" data-clklog="tid:138;cst:2;logInfo:back_to_top;" data-extralog="rid:;pos:;extra:;isBaiJiaHao:1;login:0;" data-rid="back_to_top"><div class="icon-text"><span>返回顶部</span></div><div class="icon-arrow"><span></span></div></div></div></div><script type="text/javascript">window.onload = function () {var contentContainer = document.getElementById('content-container');var bottomContainer = document.getElementById('bottom-container');var rightContainer = document.getElementById('right-container');var minContentHeight = window.innerHeight - bottomContainer.offsetHeight;if (contentContainer.offsetHeight < minContentHeight) {contentContainer.style.height = minContentHeight + 'px';bottomContainer.className += ' fixed';}if (rightContainer.children.length === 0) {rightContainer.style.width = parseInt(rightContainer.offsetWidth + 1, 10) + 'px';}};</script><script type="text/javascript" src="https://mbdp02.bdstatic.com/static/superlanding/js/lib/jquery_0affbc1.js"></script><script type="text/javascript" src="https://mbdp02.bdstatic.com/static/superlanding/js/land_min_pack_8e22d87.js"></script><script type="text/javascript" src="https://mbdp02.bdstatic.com/static/superlanding/js/article/index_bd58962.js"></script><script>try {(function () {function getQueryValue(queryName) {var query = decodeURIComponent(window.location.search.substring(1));var vars = query.split('&');for (var i = 0; i < vars.length; i++) {var pair = vars[i].split('=');if (pair[0] == queryName) {return pair[1];}}return null;}function init_report() {$ && $.ajax({url: 'https://mbd.baidu.com/newspage/api/getusername',type: 'get',dataType: 'jsonp',jsonp: 'cb',success: function (res) {if (!(res && res.username)) {var currentHref = window.location.href;window.location.href = 'https://passport.baidu.com/v2/?login&tpl=mn&u=' + encodeURIComponent(currentHref);return;};if (bds && bds.qa && bds.qa.ShortCut && bds.qa.ShortCut.initRightBar) {var fb_options = {needImage: true,appid: 215939,productLine: 90509,'upload_file': true,requiredContent: false,issuePlaceholder: '请输入问题描述',contactPlaceholder: '请填写联系方式',isReport: true,hideHotQuestion: true};bds.qa.ShortCut.initRightBar(fb_options);var proData = {'referer': window.location.href,'extend_url': window.location.href,'extend_feedback_channel': '32598','resource_id': JSON.parse(getQueryValue('context')).nid,'daily_type': '67752','remark': 'bjh'};bds.qa.ShortCut._getProData(proData);}}});}function loadReportBar() {if (window.bds && window.bds.qa && window.bds.qa.ShortCut) {init_report();} else {loadScript('https://ufosdk.baidu.com/Public/feedback/js/dist/feedback_plugin_2.0.js',function () {init_report();}, {charset: 'utf-8',id: 'feedback_script'});}return false;}document.getElementById('feedback_report(215939)').onclick = loadReportBar;})();function loadScript(url, callback, opt) {var script = document.createElement('script');var opt = opt || {};script.type = 'text/javascript';if (opt.charset) {script.charset = opt.charset;}if (opt.id) {script.id = opt.id;}if (script.readyState) {script.onreadystatechange = function () {if (script.readyState === 'loaded' || script.readyState === 'complete') {script.onreadystatechange = null;callback();}};} else {script.onload = function () {callback();};}script.src = url;document.body.appendChild(script);}} catch (error) {}</script></body></html>