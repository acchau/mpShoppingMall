// pages/register/confirmorder/confirmorder.js

var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{}
  },

  /**
   * 新增收货地址
  */
  createadress(){
    wx.navigateTo({
      url: '../createaddress/createaddress',
    })
  },

  /**
   * 提交订单
  */
  onsubmit(e){

    var that=this    
    let address = that.data.address
    
    if(!address){
      com.showToast('收货地址不能为空')     
      return
    }

    let bucketList=[]
    that.data.productList.forEach(function(item,index){
      bucketList.push({ productId: item.productID, quantity:item.quantity})
    })    
    com.getWXCode(function (code) {
      let url = config.regsubmit
      let param = { 
        buckets: bucketList, 
        cpcCode: '86' + address.areaChooseCode, 
        address: address.areadetail,
        consignee:address.name,
        phone: address.phone,
        wxCode:code
      }

      console.log(param)

      //提交订单
      httpTool.postregRequest(url, param, com.onStart
        , function (res) {        
          let payParam = res.body
          //发起支付
          wx.requestPayment(
            {
              'timeStamp': payParam.timeStamp,
              'nonceStr': payParam.nonceStr,
              'package': payParam.package,
              'signType': payParam.signType,
              'paySign': payParam.paySign,
              'success': function (reswx) {
                console.log(reswx)
                console.log("支付成功")
                wx.navigateTo({
                  url: '../regcomplete/regcomplete',
                })
              },
              'fail': function (reswx) {
                console.log(reswx)
                console.log("支付失败")
              },
              'complete': function (reswx) {
                console.log(reswx)
              }
            })
          
        }
        , function (res) {        
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
    this.setData({ 
      productList: wx.getStorageSync("suborder"), 
      address: wx.getStorageSync("createadress"),
      shopattr:wx.getStorageSync("shopattr") 
    })
    console.log(this.data.productList)
    let amount=0
    let amountpv=0
    this.data.productList.forEach(function(item,index){
      if (item.insurance){
        amount += item.preferentialPrice * item.quantity
      }else{
        amount += item.partnerPrice * item.quantity
      }
      amountpv += item.preferentialPV * item.quantity
    })

    let totalAmount = (this.data.shopattr.isForerverContract ? 300 : 100) + amount
    this.setData({ orderAmount: amount, totalAmount: totalAmount*100, amountPV: amountpv})
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