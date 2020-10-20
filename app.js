const Koa = require("koa");
const app = new Koa();
const router = require("./router/index");
const cors = require("koa-cors");
const bodyparser = require("koa-bodyparser");
const koajwt = require("koa-jwt");
const secret = require("./config/secret.json");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const fs = require("fs");
const path = require("path");
const Koa_Session = require("koa-session");
const static = require("koa-static");
// ctx.set("Access-Control-Allow-Credentials", true);
app.use(
  cors({
    credentials: true,
    //   allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ["Content-Type", "Authorization", "Accept"]
  })
);
// ctx.set("Access-Control-Allow-Credentials", true);
// app.use(cors({
//   origin: function(ctx) {
//     if (ctx.url === '/test') {
//       return false;
//     }
//     return ['http://172.20.8.28:8080','http://www.dxzc.gov.cn','http://gl.dxzc.gov.cn','http://59.230.230.40'];
//   },
//   exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//   maxAge: 5,
//   credentials: true,
//   allowMethods: ['GET', 'POST', 'DELETE'],
//   allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
//  }));

const store = {
  get (key) {
    const sessionDir = path.resolve(__dirname, "./session");
    const files = fs.readdirSync(sessionDir);
    for (let i = 0; i < files.length; i++) {
      if (files[i].startsWith(key)) {
        const filepath = path.resolve(sessionDir, files[i]);
        console.log(filepath);
        delete require.cache[require.resolve(filepath)];
        const result = require(filepath);
        console.log(result);
        return result;
      }
    }
  },
  set (key, session) {
    const filePath = path.resolve(__dirname, "./session", `${key}.js`);
    const content = `module.exports = ${JSON.stringify(session)};`;
    fs.writeFileSync(filePath, content);
  },
  destroy (key) {
    const filePath = path.resolve(__dirname, "./session", `${key}.js`);
    fs.unlinkSync(filePath);
  }
};
// 配置
let session_config = {
  key: "koa:sess" /**  cookie的key。 (默认是 koa:sess) */,
  maxAge: 86400000 /**  session 过期时间，以毫秒ms为单位计算 。*/,
  autoCommit: true /** 自动提交到响应头。(默认是 true) */,
  overwrite: true /** 是否允许重写 。(默认是 true) */,
  httpOnly: true /** 是否设置HttpOnly，如果在Cookie中设置了"HttpOnly"属性，那么通过程序(JS脚本、Applet等)将无法读取到Cookie信息，这样能有效的防止XSS攻击。  (默认 true) */,
  signed: true /** 是否签名。(默认是 true) */,
  rolling: true /** 是否每次响应时刷新Session的有效期。(默认是 false) */,
  renew: false /** 是否在Session快过期时刷新Session的有效期。(默认是 false) */,
  store
};
// 这个是配合signed属性的签名key
const session_signed_key = ["limannlee"];
app.keys = session_signed_key;
const session = Koa_Session(session_config, app);
app.use(session);

//app.use(koajwt({secret: secret.sign}).unless({path: [/^\/api\/sendVerification/,/^\/api\/GetCode/,/^\/api\/login/,  /^\/api\/GetVerificatCode/,/^\/api\/createUser/]}))//正常可用的配置
//sendVerification
//app.use(err())
// 使用中间件，注意有先后顺序

// 配置静态web服务的中间件

app.use(bodyparser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("启动了3000端口!");
});
