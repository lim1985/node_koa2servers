// var https = require('https');
// var http = require('http');
// var fs = require('fs');
// var path = require('path');
// var cheerio = require('cheerio');
// const VideoLength = require('video-length');

// var moment = require('moment');
// var charset = require('superagent-charset');
// var superagent = charset(require('superagent'));
const db = require("../config/db");
const gov = db.gov;
const qm = gov.import("../schema/qm_count.js");

class qmClass {
  static async add(data) {
    console.log(data);
    return new Promise(async resolve => {
      let res = await qm.create(data);
      console.log(res);
      resolve(res);
    });
  }
  static async count() {
    return new Promise(async resolve => {
      let res = await qm.findAndCount();
      resolve(res);
    });
  }
}

module.exports = qmClass;
