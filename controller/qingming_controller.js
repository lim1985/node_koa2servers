const qm_Model = require("../qm/index");

class qingmingController {
  static async count(ctx) {
    let data = ctx.request.query.rd;
    ctx.cookies.set("mycookie", "hello-value");

    let rd = await qingmingController.getrd(ctx);
    console.log(rd);
    console.log(data);
    let count = await qingmingController.getCount(ctx);
    console.log(count);

    if (data != rd) {
      console.log(`到这了`);
      count = count ? Number(count) : 0;
      ctx.cookies.set("count", ++count);
      ctx.cookies.set("rd", data);
      let res = await qm_Model.add({ rd: data });

      if (res.ID) {
        ++count;
      }
      ctx.body = {
        res,
        count
      };
    }

    //    console.log(ctx.request.query)
    //    ctx.cookies.set('rd', ctx.request.query.rd);
    //    let count = ctx.cookies.get('count');
    //    count = count ? Number(count) : 0;
    //    ctx.cookies.set('count', ++count);
    //    const getUserIp = (req) => {
    //     return req.headers['x-forwarded-for'] ||
    //       req.connection.remoteAddress ||
    //       req.socket.remoteAddress ||
    //       req.connection.socket.remoteAddress;
    //   }
    //   console.log(getUserIp())

    // const html=await WebchatModel.get(data);
    ctx.body = {
      count
    };
  }
  static async getCount(ctx) {
    return new Promise(async resolve => {
      let count = await qm_Model.count();
      console.log(count);
      // let count = ctx.cookies.get('count');
      resolve(count.count);
    });
  }
  static async getrd(ctx) {
    return new Promise(resolve => {
      let rd = ctx.cookies.get("rd");
      resolve(rd);
    });
  }
}
module.exports = qingmingController;
