const cheerioModel = require("../cheerio/index");

class cheerioController {
  static async getweb(ctx) {
    let data = ctx.request.query;

    const html = await cheerioModel.Go(data);
    ctx.body = {
      html
    };
  }

  static async getrednetLive(ctx) {
    let data = ctx.request.query;
    const html = await cheerioModel.GetrednetLive(data);
    ctx.body = {
      html
    };
  }
}
module.exports = cheerioController;
