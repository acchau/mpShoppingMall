
//require 引入
var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var imageUtil = require('../../utils/imageUtil.js');
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowLogin: false,
    magazId: "",
    magazInfo: {},
    show: false,
    isIOS: false,//是否为ios 设备

    indicatorDots: true, //  是否显示面板指示点
    autoplay: true, // 是否自动切换
    circular: true, // 是否采用衔接滑动
    current: 0, // 当前所在页面的 index
    interval: 1500, // 自动切换时间间隔
    duration: 500 // 滑动动画时长

  },

  test(){
    this.setData({
      magazInfo: {
        previews: [{
          picture: "https://wx.123bd.cc/images/banner.jpg"
          }
        ]
      }
    })
  },

  fetchNet() {
    var userInfo = wx.getStorageSync('userinfo')
    this.loading = true;
    var url = config.home_list+24;
    var params = {
      token: wx.getStorageSync('token'),
    }
    //调用get方法请求首页列表
    httpTool.getRequest(url, params, this.onStart, this.onSuccess, this.onFailed);

  },
  //onStart回调
  onStart() {
    wx.showLoading({
      title: '正在加载',
    })
  },
  //onSuccess回调
  onSuccess(res) {
    this.loading = false;
    // wx.hideLoading();
    const dic = res.data;
    this.setData({
      magazInfo: dic,//请求结果数据
    })
  },
  //onFailed回调
  onFailed(res) {
    console.log(res)
    this.loading = false
    wx.hideLoading();
    if (res) {
      wx.showToast({
        title: res.msg,
        image: '../../../../../image/error.png'
      })
    }
  },

  //图片加载完成
  imageLoad(res) {
    console.log(res)
    var imageSize = imageUtil.imageUtil(res)
    wx.hideLoading();
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
    wx.setNavigationBarTitle({
      title: '易创助手'
    })

    this.test();
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