// pages/mine/mini.js
var com = require("../../pages/httpTool/com.js");
var cache = require('../../utils/cache.js');
var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo: "",//个人信息
    unpaynum:0
  },

  /**
   * 通用方法
  */
  mineCom(url,success){
    let that = this
    com.login(function(_userInfo){
      console.log(_userInfo)
      if(success && url){
        success(_userInfo,that,url)        
      }else{
        wx.navigateTo({url: url,})
      }
    },function(){},true)
  },

  /**
   * 全部订单
  */
  allorder(){
    this.mineCom('../orderlist/orderlist?orderType=0')
  },

  /**
   * 待付款
  */
  unpaid(){
    this.mineCom('../orderlist/orderlist?orderType=1')
  },

  /**
   *升级代理 
  */
  upAgent(){
    this.mineCom('../upgrade/level/level',(userInfo,that,url)=>{
      
      httpTool.getloginRequest(config.upcheck,{},com.onStart,function(res){
        if(res.body == "健康顾问" || res.body == 'VIP'){
          httpTool.postloginRequest(config.upgradestep,{param:userInfo.number},com.onStart,function(res){
            console.log(res)
            switch (res.body.registerStep) {
              case 0: //选择级别
                wx.navigateTo({url: url,})
                break;
              case 4://签订协议
                wx.navigateTo({ url: '../upgrade/signagree/signagree',})
                break;
              case 5://选购产品
                wx.navigateTo({ url: '../upgrade/product/product',})
                break;
              case 6://完成
                wx.navigateTo({ url: '../upgrade/upcomplete/upcomplete',})
                break;
              case 10://存在待付款订单
                com.showToast('您已产生升级代理订单，请直接在待付款订单中完成支付')
                break;
              default:
                com.showToast('暂无升级代理相关信息，请联系管理员')
                break;
            }
          },function(err){
            console.log(err)
            com.showToast(err.message)
          })
          
        }else{
          com.showToast(`您的会员级别是${res.body}`)
        }
      },function(err){
        console.log(err)
        com.showToast(err.message)
      })
    })
  },

  /**
   * 登录提示弹框
  */
 login(){
    this.mineCom('xxxx',(userInfo,that)=>{
      that.setData({userInfo: userInfo,isLogin:true})         
      httpTool.getloginRequest(config.getunpaynum,{},com.onStart,function(res){
        that.setData({ unpaynum:res.body})
      },function(err){
        console.log(err)
        com.showToast(err.message)
      })
    })    
  },


  /**
   * 退出登录
  */
  logout(){
    cache.setCache("userinfo", "",-1)
    this.setData({
      isLogin: false,
      userInfo:"",
      unpaynum: 0
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
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
    this.login();
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
    console.log('onUnload')
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