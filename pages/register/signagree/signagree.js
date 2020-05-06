// pages/register/signagree/signagree.js

var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal: ''
  },

  /**
   * 下一步操作
  */
  next(){
    var that=this
    var url = config.saveprotocol
    var param = { param: that.data.phone}
    httpTool.postregRequest(url, param, that.onStart
    ,function(res){
      wx.navigateTo({
        url: '../purchaseproducts/purchaseproducts?phone=' + that.data.phone,
      })
    }
    ,function(res){
      com.showToast(res.message)      
    })
  },



  //获取签订协议信息
  getprotocol(phone){
    let person=wx.getStorageSync('signagree')
    if (!person){
      var that = this
      var url = config.getprotocol
      var param = { param: that.data.phone }
      httpTool.postregRequest(url, param, that.onStart
      ,function(res){     
        wx.setStorageSync('signagree', res.body)
        that.setData({ personal: res.body })
      }
      ,function(res){
        com.showToast(res.message)          
      })
    }else{
      this.setData({ personal: person })
    }
    
  },

  onStart() {
    wx.showLoading({
      title: '正在加载中',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.phone = options.phone
    this.getprotocol(options.phone)
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