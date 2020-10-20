const Router = require("koa-router");
const SmsRouter = require("../sendsms/sendsmsAction");
const receiveMo = require("../sendsms/receiveMo");
const SMS = require("../controller/SMS_controller");
const KechuangSSO = require("../KeChuang_SSO/sso");
const ChinaCMCC = require("../ChinaCMCC/index");
const ShareLink = require("../controller/shareLink_controller");
const cheerio = require("../controller/cheerio");
const Webchat = require("../controller/Webchat");
const A_V_C = require("../controller/A_V_C_Controller");
const FS_LS_Report = require("../controller/LS_FS._controller");
const kako = require("../controller/kako");
const qm = require("../controller/qingming_controller");
const dxrm = require("../controller/DXRM_Controller");
const NewHunan = require("../controller/newHunan_controller");
const router = new Router({
  prefix: "/api"
});

// router.get('/ss',(next,ctx)=>{
//     ctx.body='hello'
// })
router
  .get("/sendsms", SmsRouter.Send)
  .get("/mo", receiveMo.mo)
  .get("/sendstatus", SmsRouter.GetSendstatus)
  .post("/smsAddrecord", SMS.add)
  .get("/smsUpdaterecord", SMS.Update)
  .get("/GetSmsSucceedCount", SMS.SelectSucceedCount)
  .get("/getsmsRecord", SMS.getsmsRecord) //获取短信发送记录
  .get("/getsmsmo", SMS.getsmsmo) //获取MO发送记录
  //添加安装大祥融媒的人
  .get("/finduserByTel", dxrm.finduserByTel)
  .get("/DXRMUserinfo", dxrm.getUserInformation)
  .post("/adddxrm", dxrm.createUser)
  .get("/getDeplist", dxrm.GetDepListLikeName)
  .get("/GetAllDepLists", dxrm.GetAllDepLists)
  .get("/seletDepCount", dxrm.seletDepCount)
  // getsmsRecord(ctx)getsmsmo
  //��ȡʡ���½�û���Ϣ
  .get("/GetAllUserInfo", KechuangSSO.getUserinfo)
  .post("/sendCMCC", ChinaCMCC.InitBody)
  .post("/newsendCMCC", ChinaCMCC.newinitsmsbody)
  .get("/sendVerification", ChinaCMCC.GetVerificatCode)
  .get("/checkCaptcha", ChinaCMCC.checkCaptcha)
  .get("/checkCaptchatoken", ChinaCMCC.checkCaptchatoken)
  .get("/GetVerificatCodeAdSmssecret", ChinaCMCC.GetVerificatCodeAdSmssecret)

  //大祥区人民政府办MO
  .post("/dxqrmzfbmo", receiveMo.Dxqrmzfbmo)
  //大祥区区委办MO
  .post("/dxqqwbmo", receiveMo.Dxqqwbmo)
  //默认mo接收
  .post("/moCMCC", receiveMo.CMCCMO)
  .post("/sendCMCCStatus", receiveMo.CMCCSendStatus)
  .get("/add", ShareLink.add)
  .get("/get", ShareLink.get)
  .get("/getAllsharelink", ShareLink.countAllshareLink)
  .get("/getweb", cheerio.getweb) //抓取网页
  .get("/getrednetLive", cheerio.getrednetLive) //抓取红网直播页
  .get("/getwebchat", Webchat.getwebchat)
  .get("/getall", A_V_C.getall)
  //A_v_c 防疫等级系统
  .get("/getbyuuid", A_V_C.getBYuuid)
  .get("/GetVistorbyTel", A_V_C.GetVistorbyTel)
  .post("/register", A_V_C.registers)
  .post("/reportadd", FS_LS_Report.reportAdd)
  .get("/CheckTel", FS_LS_Report.reportCheckTel)
  .get("/getUserInfo", FS_LS_Report.getUserReport)
  .post("/reportupdate", FS_LS_Report.updateUserReport)
  .get("/checkAdmin", FS_LS_Report.CheckAdminTel)
  .post("/auditlog", FS_LS_Report.auditlog)
  .post("/addRecords", FS_LS_Report.addRecords)
  .get("/getDataCounts", FS_LS_Report.getDataCounts)
  .get("/getAllDataGroupbyJDID", FS_LS_Report.getAllDataGroupbyJDID)
  //社区等级
  .post("/kakoAdd", kako.kakoInfoAdd)
  .post("/kakoselect", kako.kakoInfoselect)
  .get("/AllKakoandCounts", kako.getAllKakoandCounts)
  //清明祭扫
  .get("/count", qm.count) //计数
  //新湖南
  .get("/init_sign", NewHunan.init_sign) //计数
  .post("/sendToNewHunan", NewHunan.sendToNewHunan); //计数


module.exports = router;
