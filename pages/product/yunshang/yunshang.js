// pages/product/yunshang/yunshang.js

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

    isshow: false,
  },

  /**
   * 获取购物车
  */
  getbucketlist(onsuccess){
    var that = this
    var url = config.bucketlist
    var param = {
      orderType: 64
    }

    httpTool.getloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        onsuccess(res.body)        
      },
      function (res) {
        console.log(res);
        wx.hideLoading();

      }
    )
  },

  /**
   * 清空购物车
  */
  clearbucketlist() {
    var that = this
    var url = config.clearbucket   

    httpTool.postloginRequest(url, null, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();

      },
      function (res) {
        console.log(res);
        wx.hideLoading();

      }
    )
  },

  /**
   * 添加产品到购物车 -服务端
  */
  addbucket(product,onSuccess){
    var that = this
    var url = config.addbucket
    var param = {
      productId: product.productID,
      quantity:product.step, 
      orderType:64
    }

    httpTool.postloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        onSuccess(res)
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '购物车添加产品失败',
          icon: 'none',
          duration: 5000
        })
      }
    )
  },

  /**
   * 修改购物车
  */
  modifybucketlist(proId, num, onSuccess){
    var that = this
    var url = config.modifybucket
    var param = {
      productId: proId,
      quantity: num,
      orderType: 64
    }

    httpTool.postloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        onSuccess(res)
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '修改购物车失败',
          icon: 'none',
          duration: 5000
        })
      }
    )
  },


  /**
   * 添加产品到购物车
  */
  addshopcard(e) {

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
   * 具体的添加购物车操作
  */
  addshopcardaction(e){
    var that = this
    let productId = e.detail.currentTarget.dataset.productid
    let product = that.data.productList.filter(function (item) { return item.productID == productId })[0]

    //获取购物车列表
    that.getbucketlist(function(bucketlist){
      let quantity = 0
      if(bucketlist.length>0){ //购物车不为空
        bucketlist.forEach(function (item, index) {
          quantity += item.quantity
        })    
        that.setData({
          shopcardcount: quantity
        })
        //查找是购物车中是否存在产品
        let originprolist = bucketlist.filter(function (item) { return item.productId == productId })
       
        if (originprolist.length>0){
          let originpro = originprolist[0]
          com.arrRemove(bucketlist,originpro)
          originpro.quantity += product.step
          bucketlist.push(originpro)
          that.modifybucketlist(originpro.productId,originpro.quantity,function(res){
            let oshopcardcount = that.data.shopcardcount + product.step
            that.setData({
              shopcardcount: oshopcardcount
            })
          }) 
        }else{
          bucketlist.push(product) //返回的购物车列表
          
          that.addbucket(product,function(res){
            let oshopcardcount = that.data.shopcardcount + product.step
            that.setData({
              shopcardcount: oshopcardcount
            })
          })
        }

      }else{//购物车为空
        bucketlist.push(product)
        //调用增加接口 ,要考虑失败的情况，待续
        that.addbucket(product, function (res) {
          let oshopcardcount = that.data.shopcardcount + product.step
          that.setData({
            shopcardcount: oshopcardcount
          })
        }) 
        
      }
    })


  },

  /**
 * 跳转到购物车页面
*/
  goshoppingcard() {
    wx.switchTab({
      url: '../../shoppingcard/shoppingcard'
    })
  },


  /**
   * 获取产品列表
  */
  getcommodityproduct(i, s) {

    let that = this
    com.login(function(_userInfo){
            
      let url = config.againproduct    
      let param = {
        pageIndex: i,
        pageSize: s,
        isAsc: true
      }

      httpTool.getloginRequest(url, param, com.onStart,
        function (res) {
          console.log(res)
          wx.hideLoading();
          let pageResult = res.body.pageResult
          let originalproductList = that.data.productList
          if (pageResult) {
            that.setData({
              productList: originalproductList.concat(pageResult.dataList),
              isshow: true,
              totalcount: pageResult.totalCount,
              pagesize: pageResult.pageSize,
              pageindex: pageResult.pageIndex
            })
          }

        },
        function (res) {
          console.log(res);
          wx.hideLoading();
          com.showToast(res.message)
        }
      )
      
    },function(){that.setData({userInfo: ''})})

  },

  showshopcardcount(){
    let that = this
    if (cache.getCache('userinfo')){
      that.setData({
        userInfo:cache.getCache('userinfo')
      })
      that.getbucketlist(function (bucketlist) {
        let quantity = 0
        if (bucketlist.length > 0) { //购物车不为空
          bucketlist.forEach(function (item, index) {quantity += item.quantity})
          that.setData({
            shopcardcount: quantity
          })
        } else {  //购物车为空
          that.setData({
            shopcardcount: 0
          })
        }
      })
    }else{
      that.setData({
        userInfo:''
      })
    }
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
    this.showshopcardcount()
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