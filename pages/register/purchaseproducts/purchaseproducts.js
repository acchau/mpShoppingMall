// pages/register/purchaseproducts/purchaseproducts.js
var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {    
    productList:'',
    
    shopcardList:[],
    shopcardcount:0,

    nextText:"去结算",
    isshow:false
  },

  /**
   * 点击下一步
  */
  next(){

    if (this.data.shopcardList.length>0){
      var shopattr=wx.getStorageSync("shopattr")
      var url = '../shoppingcard/shoppingcard'  

      //有保险产品
      if (shopattr.isJoinedInsurance){
        url ='../Insuranceproducts/Insuranceproducts'
      }

      url = url + '?phone=' +this.data.phone
      wx.setStorageSync('shopcard', { productList: this.data.shopcardList, count: this.data.shopcardcount})      

      wx.navigateTo({
        url: url
      })
    }else{
      com.showToast('请先选择产品')      
    }


  },

  /**
   * 获取产品列表
  */
  getcommodityproduct(i,s){
    var that=this
    var url = config.getcommodity
    var param={
      phone: that.data.phone,
      searchInput:{
        pageIndex: i,
        pageSize: s,
        isAsc:true
      }
    }

    httpTool.postregRequest(url, param, that.onStart,
      function (res) {
        console.log(res);
        
        wx.setStorageSync("shopattr", { 
          isForerverContract: res.body.isForerverContract,
          isJoinedInsurance: res.body.isJoinedInsurance,
          minTotalMoney: res.body.minTotalMoney
        })
        
        let pageResult=res.body.pageResult
        if(pageResult){
          that.setData({
            productList:pageResult.dataList,
            nextText: res.body.isJoinedInsurance ? '下一步，选择俱乐部产品' :'去结算',
            isshow: true
          })
        }

      },
      function (res) {
        console.log(res);        
      }
    )
  },

  /**
   * 添加产品到购物车
  */
  addshopcard(e){
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
      product.quantity=product.step
      addshopcardList.push(product)
    }
    

    that.setData({ 
      shopcardList: addshopcardList,
      shopcardcount: shopcardcount
    })
    
    
  },

  /**
   * 跳转到购物车页面
  */
  goshoppingcard(){
    this.next()
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.phone=options.phone  
    
    this.getcommodityproduct(1, 10)
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