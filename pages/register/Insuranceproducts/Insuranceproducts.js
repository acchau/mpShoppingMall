// pages/register/Insuranceproducts/Insuranceproducts.js

var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList:'',
    isshow:false,

    shopcardList: [],//注册产品列表

    shopcardcount:0,
    insuranceshopcardList: [] //保险产品列表
  },

  /**
   * 添加产品到购物车
  */
  addshopcard(e) {

    var that = this
    let index = e.detail.currentTarget.dataset.index
    let addishopcardList = that.data.insuranceshopcardList
    let product = that.data.productList[index]
    let shopcardcount=that.data.shopcardcount

    if (addishopcardList.length>0){
      if (addishopcardList[0].productID == product.productID){
        addishopcardList=[] //去掉已选择的产品
        shopcardcount-=1
      }else{
        com.showToast('俱乐部产品只能选择其中一个，如需重选，请点击已选产品"+购物车"按钮取消选择')        
      }
    }else{
      product.quantity=1
      product.insurance=true //保险产品
      shopcardcount+=1
      addishopcardList.push(product)
    }

    that.setData({
      insuranceshopcardList: addishopcardList,
      shopcardcount: shopcardcount
    })


  },

  /**
   * 购物车按钮
  */
  goshoppingcard(){
    this.settlement()
  },

  /**
   * 去结算
  */
  settlement(){
    let ishopcardList=this.data.insuranceshopcardList;
    if(ishopcardList.length<=0){
      com.showToast('请选择俱乐部产品')      
    }else{

      wx.setStorageSync("insuranceshopcard", ishopcardList)
      wx.navigateTo({
        url: '../shoppingcard/shoppingcard?phone=' + this.data.phone,
      })

    }
  },

  /**
   * 上一步
  */
  previous(){
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 获取产品列表
  */
  getcommodityproduct(i, s) {
    var that = this
    var url = config.getInsuranceProduct
    var param = {
      // phone: that.data.phone,
      // searchInput: {
      //   pageIndex: i,
      //   pageSize: s,
      //   isAsc: true
      // }
    }

    httpTool.getregRequest(url, param, that.onStart,
      function (res) {              
        if (res.body) {
          that.setData({
            productList: res.body,
            isshow:true
          })
        }

      },
      function (res) {
        console.log(res);
      }
    )
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.phone = options.phone
    this.data.phone = "15918709933"

    this.getcommodityproduct(1, 10)

    var shopcard=wx.getStorageSync('shopcard')
    if (shopcard){
      this.setData({ 
        shopcardcount:shopcard.count
        , shopcardList: shopcard.productList
        })
    }

  },

/**
* 加载显示框
*/
  onStart() {
    wx.showLoading({
      title: '正在加载',
    })
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