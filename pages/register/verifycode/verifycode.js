// pages/register/verifycode/verifycode.js
var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");
var cache = require('../../../utils/cache.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    vcode: '',
    smscode: '',
    phonemsg: '',
    vcodemsg: '',

    time: 0, //倒计时时间
    timeData: {},
    btncodeshow: true,//获取验证码按钮是否显示
    logourl: config.logurl
  },

  /**
   * 获取注册的token
  */
  getregtoken(){
    var that=this
    var url = config.regtoken
    var param={
      phone: that.data.phone,
      code: that.data.vcode
    }
    httpTool.postRequest(url, param, com.onStart
    , function (res) {
        cache.setCache('reginfo', res.body, res.body.expireInSeconds)
        console.log('reginfo')
        console.log(res)
        that.gostep(that.data.phone)
     }
    , function (res) { 
      console.log(res)
      com.showToast(res.message)
    })



  },

  /**
   * 获取输入框的值
  */
  onPChange(e) {
    if (e.detail != '') {
      this.setData({
        phone: e.detail,
        phonemsg: '',
      })
    }
  },

  onVChange(e) {
    if (e.detail != '') {
      this.setData({
        vcode: e.detail,
        vcodemsg: '',
      })
    }
  },

  /**
   * 倒计时
  */
  onTChange(e) {
    this.setData({
      timeData: e.detail
    });
  },

  /**
   * 倒计时结束
  */
  timefinished() {
    this.setData({ btncodeshow: true })
  },

  /**
   * 获取短信验证码
  */
  getcode() {
    var that = this
    if (that.data.phone == '') { that.setData({ phonemsg: '手机号码不能为空' }); return; }
    if (!(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(that.data.phone))) { that.setData({ phonemsg: '手机号码格式有误' }); return; }

    var url = config.registerSms
    var param = { phone: that.data.phone }
    
    httpTool.getRequest(url, param, com.onStart, function (res) {
      that.setData({
        btncodeshow: false,
        time: 60 * 1000,
        smscode: res.body
      })

      console.log(res);
      com.showToast(res.message)            
    }
    , function (res) {  
        com.showToast(res.message)      
      })


  },

  /**
   * 下一步
  */
  next() {
    var that = this
    if (that.data.phone == '') { that.setData({ phonemsg: '手机号码不能为空' }); return; }
    if (!(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(that.data.phone))) { that.setData({ phonemsg: '手机号码格式有误' }); return; }

    if (that.data.vcode == '') { that.setData({ vcodemsg: '验证码不能为空' }); return; }
    if (that.data.vcode.toUpperCase() == that.data.smscode.toUpperCase()) {

      that.getregtoken()      

    } else {
      that.setData({ vcodemsg: '验证码错误' })
    }


  },


/**
 * 获取跳转步骤
*/
gostep(phone){
  var stepnavigateURLArr = ['../personal/personal', '../personal/personal'
  , '../personal/personal', '../personal/personal', '../signagree/signagree'
  , '../purchaseproducts/purchaseproducts','../regcomplete/regcomplete']

  var url = config.getstep
  var param={param:phone}
  httpTool.postregRequest(url, param,com.onStart
  ,function(res){    
    wx.navigateTo({
      url: stepnavigateURLArr[res.body.registerStep] + '?phone=' + phone,
    })
  }
  ,function(res){    
    com.showToast(res.message)    
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})