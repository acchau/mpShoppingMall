// pages/upgrade/product/product.js
var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");
var cache = require('../../../utils/cache.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],

    shopcardList: [],
    shopcardcount: 0,
  },

  /**
   * 去结算
  */
  next(){
    this.goshoppingcard()
  },

/**
 * 跳转到购物车页面
*/
goshoppingcard() {
  if(this.data.shopcardcount <=0){
    com.showToast('您还没有选购产品')
    return
  }
  wx.navigateTo({
    url: '../shoppingcart/shoppingcart',
  });
},

  /**
   * 添加产品到购物车
  */
 addshopcard(e) {
  console.log(e)
  //先校验用户是否登录，未登录的用户不能添加产品到购物车
  if (!this.data.userInfo){
    var _userInfo = cache.getCache('userinfo')
    if (_userInfo) {
      this.setData({
        userInfo: _userInfo
      })
      
      this.addshopcardaction(e)
    
    }else{
      wx.navigateTo({
        url: '../../login/login',
      })
      return
    }
  }else{  //已登录
    this.addshopcardaction(e)
  }
},

/**
 * 添加购物车的操作
*/
addshopcardaction(e){
  var that=this
  let index = e.detail.currentTarget.dataset.index
  let addshopcardList = that.data.shopcardList
  let product = that.data.productList[index]
  let shopcardcount = that.data.shopcardcount+product.step

  let existIndex=-1

  for (let i = 0; i < addshopcardList.length;i++){
    let item = addshopcardList[i]
    if (item.productID==product.productID){
      existIndex=i
      product.quantity=item.quantity+product.step
      break;
    }
  }

  if(existIndex>-1){//添加已存在的产品
    addshopcardList[addshopcardList]=product
  } else {//添加不存在的产品
    console.log(addshopcardList)
    product.quantity=product.step
    addshopcardList.push(product)
  }
    

  that.setData({ 
    shopcardList: addshopcardList,
    shopcardcount: shopcardcount
  })

  let number = wx.getStorageSync('number');
  wx.setStorageSync(number+"upshopcartlist", this.data.shopcardList)
  wx.setStorageSync(number+'upshopcartcount',this.data.shopcardcount)
},

  /**
   * 获取产品列表
  */
 getcommodityproduct(i, s) {

  let that = this
  com.login(function(_userInfo){
                  
    let param = {
      pageIndex: i,
      pageSize: s,
      isAsc: true
    }

    httpTool.getloginRequest(config.getupcommodity, param, com.onStart,
      function (res) {
        console.log(res)
        
        let pageResult = res.body.pageResult
        let originalproductList = that.data.productList
        if (pageResult) {
          that.setData({
            productList: originalproductList.concat(pageResult.dataList),
            totalcount: pageResult.totalCount,
            pagesize: pageResult.pageSize,
            pageindex: pageResult.pageIndex,
            isshow:true
          })
          wx.setStorageSync('upminiTotalMoney', res.body.minTotalMoney); //最小满足金额
        }

      },
      function (res) {
        console.log(res);
        com.showToast(res.message)
      }
    )
    
  },function(){that.setData({userInfo: ''})})

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
    this.setData({productList:[]})
    this.getcommodityproduct(1, 10)
    let number = wx.getStorageSync('number');
    //初始化购物车
    this.setData({
      shopcardList:wx.getStorageSync(number+'upshopcartlist') || [],
      shopcardcount:wx.getStorageSync(number+'upshopcartcount') || 0
    })
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
    console.log('上拉加载')

    //计算请求的页码
    let pagecount = Math.ceil(this.data.totalcount/this.data.pagesize)
    if(pagecount > this.data.pageindex){
      this.getcommodityproduct(this.data.pageindex + 1, this.data.pagesize)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})