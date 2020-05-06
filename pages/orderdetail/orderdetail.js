// pages/orderdetail/orderdetail.js
var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 订单支付
  */
  payment(e){
    
    let orderId = e.currentTarget.dataset.orderid  
    let orderType = e.currentTarget.dataset.ordertype  
    com.getWXCode(function(code){
      let url = config.payOrder
      let param = {
        orderId:orderId,
        wxCode:code
      }
      console.log(param)
      httpTool.postloginRequest(url, param, com.onStart
        , function (res) {
          wx.hideLoading()          
          //发起支付
          com.payment(res.body,orderType)          
        }
        , function (res) {
          wx.hideLoading()
          console.log('出错啦')
          console.log(res)
          com.showToast(res.message)
        })

    })
  },

  /**
   * 获取订单明细
  */
  getorderdetail(orderid){
    let that = this
    let url = `${config.orderdetail}${orderid}`    
    httpTool.getloginRequest(url,{},com.onStart,function(res){
      console.log(res)
      wx.hideLoading()
      that.setData({
        orderdetail:res.body
      })
    },function(err){
      wx.hideLoading()
      console.log('出错啦')
      console.log(res)
      com.showToast(res.message)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getorderdetail(options.orderid)
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