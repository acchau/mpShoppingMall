// pages/orderlist/orderlist.js
var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {  
    tabType:0,
    tabNav: ['全部', '待付款'],
    orderList:[],
    unpayorderList: [],
  },

  /**
   * 切换列表
  */
  tabSelect(e) {
    
    this.setData({
      tabType: e.currentTarget.dataset.id,
      orderList: [],
      unpayorderList: []
    })
    
    this.getorderlist(1,10)
  },

  /**
   * 调整到详细页面
  */
  orderdetail(e){    
    wx.navigateTo({
      url: `../orderdetail/orderdetail?orderid=${e.detail.currentTarget.dataset.orderid}`,
    });
  },

  /**
   * 获取订单列表
  */
 getorderlist(i,s){

  let that = this
  let url = config.orderlist   
  let param = {
    pageIndex: i,
    pageSize: s,
    isAsc: false
  }

  if(that.data.tabType == 1){
    param.searchField = "0"
  }

  console.log(param)

  httpTool.postloginRequest(url, param, com.onStart,
    function (res) {
      console.log(res)
      wx.hideLoading();
      if(that.data.tabType == 0){
        let orderList = res.body.orderList
        let originalorderList = that.data.orderList
        if (orderList) {
          that.setData({
            orderList: originalorderList.concat(orderList),
            totalcount: res.body.totalCount,
            pagesize: s,
            pageindex: i          
          })
        }
      }else{
        let orderList = res.body.orderList
        let originalUnpayorderList = that.data.unpayorderList
        if (orderList) {
          that.setData({
            unpayorderList: originalUnpayorderList.concat(orderList),
            unpaytotalcount: res.body.totalCount,
            unpaypagesize: s,
            unpaypageindex: i
          })
        }
      }

    },
    function (res) {
      console.log(res);
      wx.hideLoading();
    }
  )
 },

/**
 * 立即支付
*/
  payment(e){
    
    let orderId = e.detail.currentTarget.dataset.orderid    
    let orderType = e.detail.currentTarget.dataset.ordertype
    
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({ tabType: options.orderType})
    console.log(this.data.tabType)
    this.getorderlist(1,10)
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
    wx.switchTab({
      url: '../mine/mine',
    })
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
    console.log('上拉加载')
  
    //计算请求的页码
    if(this.data.tabType == 0){
      let pagecount = Math.ceil(this.data.totalcount/this.data.pagesize)
      if(pagecount > this.data.pageindex){
        this.getorderlist(this.data.pageindex + 1, this.data.pagesize)
      }
    }else{
      let pagecount = Math.ceil(this.data.unpaytotalcount / this.data.unpaypagesize)
      if (pagecount > this.data.unpaypageindex) {
        this.getorderlist(this.data.unpaypageindex + 1, this.data.unpaypagesize)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})