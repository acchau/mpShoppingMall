
var host = ""   //	

var config = {

  appid: '',
  secret: '',

  // 下面的地址配合 Server 工作
  host,

  //登录页logo图标
  logurl: `${host}/images/logo.jpg`,

  //注册token
  regtoken: `${host}/api/Auth/reg/token`,

  //登录
  login: `${host}/api/Auth/Authenticate`,

  //忘记密码
  forget: `${host}/api/User/forget`,

  //获取短信验证码
  registerSms: `${host}/api/User/reg/smscode`,

  //获取省市区
  area: `${host}/api/Area/get/1`,

  //检查推荐人编号是否存在
  existsdirect: `${host}/api/Check/direct`,

  //检查店铺编号是否存在
  existstorename: `${host}/api/Check/get/storename`,

  //完善个人信息提交
  savepersonal: `${host}/api/User/reg/personal/save`,

  //获取签订协议前信息
  getprotocol: `${host}/api/User/reg/protocol/get`,

  //签订协议
  saveprotocol: `${host}/api/User/reg/protocol/save`,

  //获取步骤
  getstep: `${host}/api/Check/reg/step`,

  //注册合伙人获取商品
  getcommodity: `${host}/api/Commodity/get/page`,

  //获取保险产品列表
  getInsuranceProduct: `${host}/get/product`,

  //提交订单(注册)
  regsubmit: `${host}/api/User/reg/submit`,

  //云商进货产品获取
  againproduct: `${host}/api/Commodity/get/again`,

  //获取购物车列表
  bucketlist: `${host}/api/Bucket/get`,

  //修改购物车产品
  modifybucket: `${host}/api/Bucket/modify`,

  //添加产品到购物车
  addbucket: `${host}/api/Bucket/add`,

  //删除购物车产品
  deletebucket: `${host}/api/Bucket/delete`,
  
  //清空购物车产品
  clearbucket: `${host}/api/Bucket/clear`,

  //获取收货列表
  getaddresslist: `${host}/api/Address/get`,

  //新增地址
  addaddress: `${host}/api/Address/add`,

  //修改地址 
  modifyaddress: `${host}/api/Address/modify`,

  //删除地址
  deleteyaddress: `${host}/api/Address/delete`,

  //云商进货确认订单信息
  getpreorder:`${host}/api/Order/get/preorder`,

  //云商进货订单提交
  yunshangOrdersubmit:`${host}/api/Order/submit`,

  //二级密码验证
  secondpwd:`${host}/api/User/verify/sencondarypwd`,

  //获取订单列表
  orderlist:`${host}/api/Order/query`,

  //我的订单-订单支付
  payOrder:`${host}/api/Order/pay`,

  //订单详情页
  orderdetail:`${host}/api/Order/detail/`,
  
  //获取/签订升级代理协议
  upprotocol:`${host}/api/Upgrade/protocol`,

  //校验该账号是否可以进行升级操作
  upcheck:`${host}/api/Upgrade/check`,

  //分页获取升级代理商品
  getupcommodity:`${host}/api/Commodity/get/upgrade`,

  //获取电子币余额
  getbalance:`${host}/api/User/balance`,

  // 升级代理提交订单
  upgradesubmit:`${host}/api/Upgrade/submit`,
  
  //升级代理步骤
  upgradestep:`${host}/api/Check/upgrade/step`,

  //获取未付款订单数量
  getunpaynum: `${host}/api/User/unpay/num`

};
//对外把对象config返回
module.exports = config
