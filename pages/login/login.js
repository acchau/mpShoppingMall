// pages/login/login.js

var httpTool = require("../../pages/httpTool/httpTool.js");
var com = require("../../pages/httpTool/com.js")
var config = require("../../pages/httpTool/config.js");
var cache = require('../../utils/cache.js');
var MCAP = require('../../utils/mcaptcha.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:'',//会员编号
    pwd: '',//会员密码   
    codeStr: '', //生成的验证码
    vcode: '', //输入的验证码
    numberMsg:'',
    pwdMsg:'',
    vcodeMsg:'',
    logourl: config.logurl
  },

  /**
   * 注册
  */
  register() {
    wx.navigateTo({
      url: '../register/verifycode/verifycode',
    })
  },

  /**
   * 忘记密码
  */
  forgetpwd(){
    wx.navigateTo({
      url: '../forgetpwd/forgetpwd',
    })
  },

  /**
   *登录 
   */
  login(){
    var that = this;
    
    if (that.data.number == '') { that.setData({ numbermsg: '会员编号不能为空' });return;}
    if (that.data.pwd == '') { that.setData({ pwdMsg: '会员密码不能为空' }); return; }
    if (that.data.vcode == '') { that.setData({ vcodeMsg: '验证码不能为空' }); return; }

    if (!(/^[a-zA-Z]\d+$/.test(that.data.number))) { that.setData({ numbermsg: '会员编号格式有误' }); return; }
    if (!(/^[a-zA-Z]\d{1,11}$/.test(that.data.number))) { that.setData({ numbermsg: '会员编号长度不能超过11位' });return;}
    if (!(/^\w+$/.test(that.data.pwd))) { that.setData({ pwdMsg: '数字或字母' }); return; }

    if (that.data.codeStr.toUpperCase() == that.data.vcode.toUpperCase()){
      var url=config.login
      var param={
        userName: that.data.number,
        password:that.data.pwd
      }

      httpTool.postRequest(url, param, com.onStart, 
        function (res) {          
          res.body.leveName = res.body.businessLevel.substring(0, 1)
          console.log(res.body)
          cache.setCache('userinfo', res.body, res.body.expireInSeconds)
          wx.setStorageSync('number', res.body.number)
          wx.setStorageSync("level", res.body.businessLevel)          
          wx.navigateBack({
            delta: 1
          })
        },
        function (res) {
          wx.hideLoading();
          com.showToast(res.message)                    
        }
      )

    }else{      
      that.setData({ vcodeMsg: '验证码错误' })
      that.updateVCode()
    }
    
  },

  /**
   * 获取输入框的值
  */
  onNChange(e) { this.setData({ number: e.detail.trim()})},
  onPChange(e) { this.setData({ pwd: e.detail.trim() }) },
  onVChange(e) { this.setData({ vcode: e.detail.trim() }) },

  /**
   * 失去焦点触发
  */
  onNBlur(e) {
    if (!(/^[a-zA-Z]\d+$/.test(this.data.number))) { 
      this.setData({ numbermsg: '会员编号格式有误' })
      return
    }else{
      this.setData({ numbermsg: '' })
    } 

    if (!(/^[a-zA-Z]\d{1,11}$/.test(this.data.number))) { 
      this.setData({ numbermsg: '会员编号长度不能超过11位' }) 
    } else { 
      this.setData({ numbermsg: '' })
    }
  },

  onPBlur(e) {
    if (!(/^\w+$/.test(this.data.pwd))) { 
      this.setData({ pwdMsg: '数字或字母' })
    }else{
      this.setData({ pwdMsg: '' })
    }
  },

  onVBlur(e){
    if (this.data.vcode == '') { 
      this.setData({ vcodeMsg: '验证码不能为空' })
    }else{
      this.setData({ vcodeMsg: '' })
    }
  },


  /**
   * 更新验证码
  */
  updateVCode(){
    this.initDraw();
  },

  /**
   * 制作验证码
   */
  initDraw() {
    var that = this;
    var codes = that.getRanNum();
    that.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 120,
      height: 40,
      code: codes
    });
  },

  /**
   * 获取随机数
   */
  getRanNum: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.initDraw(); //生成验证码
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