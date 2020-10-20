const WebchatModel = require("../webchat/index");

class WebchatController {
  static async getwebchat(ctx) {
    let data = ctx.request.query;

    const html = await WebchatModel.get(data);
    ctx.body = {
      webchat: JSON.parse(html)
    };
  }
}
module.exports = WebchatController;
