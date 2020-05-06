// pages/shoppingcard/shoppingcard.js

var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

var cache = require('../../utils/cache.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {

    allchecked: false,
    productList: [], //购物车产品列表

    orderAmount: 0, //合计金额
    shoporderAmount: 0, //报单合计金额
    checkedlength:0, //选择产品件数
    host:config.host
  },

  /**
   * 删除产品
  */
  onClose(event) {
    var that = this
    let productindex = event.detail.currentTarget.dataset.index
    const { position, instance } = event.detail.detail;

    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '确定要删除该商品吗？',
          success(res) {
            if (res.confirm) {
              that.deleteproduct(productindex)
              instance.close()
            } else if (res.cancel) {
              instance.close();
            }
          }
        })
        break;
    }
  },

  /**
   * 删除产品
  */
  deleteproduct(productindex) {

    var initproductList = this.data.productList
    var product = initproductList[productindex]

    initproductList.splice(productindex, 1)

    this.setData({ productList: initproductList })

    //调用删除购物车产品接口
    let that = this
    that.deletebucket(product.productId,function(res){
      wx.setStorageSync("ysshopcard", { productList: initproductList })
      that.calcorderamount(that.data.productList)
    })
  },

  /**
   * 修改产品的数量
  */
  onStepChange(e) {

    let productIndex = e.detail.currentTarget.dataset.index
    let initproductList = this.data.productList

    let product = initproductList[productIndex]
    product.quantity = e.detail.detail

    //调用修改接口：
    let that = this
    that.modifybucketlist(product.productId, product.quantity,function(res){
      initproductList[productIndex] = product

      that.setData({
        productList: initproductList
      })

      that.calcorderamount(initproductList)
    })    

  },

  /**
   * checkbox选中
  */
  onChange(e) {

    let initproductlist = this.data.productList
    let productIndex = e.detail.currentTarget.dataset.index
    let product = initproductlist[productIndex]

    product.checked = e.detail.detail
    initproductlist[productIndex] = product

    let checkedlength = 0
    initproductlist.forEach(function (item, index) {
      if (item.checked) {
        checkedlength = checkedlength + 1
      }
    })

    this.setData({
      productList: initproductlist,
      allchecked: checkedlength == initproductlist.filter(item=>{return item.productState}).length ? true : false,
      checkedlength: checkedlength
    })
    this.calcorderamount(initproductlist)
  },

  /**
   * 全选按钮
  */
  onAllChange(e) {
    let initproductlist = this.data.productList
    let ischecked = e.detail.detail

    this.data.productList.forEach(function (item, index) {      
      item.checked = item.productState ? ischecked:false
      initproductlist[index] = item      
    })

    this.setData({
      allchecked: ischecked,
      productList: initproductlist,
      checkedlength: ischecked?initproductlist.filter(function(item){return item.checked}).length:0
    })

    this.calcorderamount(initproductlist)
  },

  /**
   * 提交订单
  */
  onsubmit() {

    if (this.data.checkedlength <= 0) {
      com.showToast('请先选择结算的产品')
      return
    }      

    //跳转到提交订单页面
    let choceProducts = this.data.productList.filter(function (item) { return item.checked == true })
    let that = this
    let url = config.getpreorder
    let param = []

    choceProducts.forEach(function(item){
      param.push({
        productId: item.productId,
        quantity: item.quantity,
        orderType: 64
      })
    })

    console.log('云商进货确认订单信息')
    console.log(param)
    
    
    httpTool.postloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        wx.setStorageSync("yssuborder", res.body)
        wx.navigateTo({
          url: '../confirmorder/confirmorder',
        })
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        com.showToast('云商进货确认订单信息失败')
      }
    )


    


  },
  /**
   * 获取产品价格
  */
  getprice: function (level, item) {
    var price = item.preferentialPrice
   
    switch (level) {
      case "VIP":
        price = item.preferentialPrice
        break;
      case "健康顾问":
        price = item.preferentialCustomerPrice
        break;
      case "合伙人":
        price = item.partnerPrice
        break;
      case "联合创始人":
        price = item.unionPrice
        break;
      case "核心战略":
        price = item.corePrice
        break;
    }
    return price
  
  },
  /**
   * 计算订单金额
  */
  calcorderamount(productList) {
    let amount = 0
    let that = this
    productList.forEach(function (item, index) {
      if (item.checked) {
        amount += that.getprice(that.data.level,item) * item.quantity
      }
    })

    this.setData({ orderAmount: amount * 100 })
  },

  /**
    * 登录提示弹框
   */
  login(){
    let that = this
    com.login(function(_userInfo){
      that.setData({userInfo: _userInfo})
      let initproductlist = that.data.productList
      that.getbucketlist(function (res) {
          let resruslt = res.map(function(item){ 
            if(item.productState && initproductlist.some(function(i){return i.checked && i.productId == item.productId})){
              item.checked =true
            }
            return item
          })
          let checkednum = resruslt.filter(function(item){return item.checked ==true}).length
          let allchecked = (resruslt.filter(item=>item.productState).length == checkednum && checkednum >0) ? true:false
          that.setData({ productList: resruslt, allchecked: allchecked, checkedlength: checkednum, level: wx.getStorageSync("level")})
          that.calcorderamount(that.data.productList)
      })
    },function(){that.setData({userInfo: ''})})
  },

  /**
   * 获取购物车
  */
  getbucketlist(onSuccess) {
    var that = this
    var url = config.bucketlist
    var param = {
      orderType: 64
    }

    httpTool.getloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        
        if (onSuccess instanceof Function){
          onSuccess(res.body)
        }
        
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        com.showToast('获取购物车信息失败')
      }
    )
  },

  /**
  * 修改购物车
  */
  modifybucketlist(proId, num, onSuccess) {
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
        if (onSuccess instanceof Function){
          onSuccess(res)
        }
        
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        com.showToast('修改购物车商品失败')
      }
    )
  },

  /**
  * 删除购物车
  */
  deletebucket(proId, onSuccess) {
    var that = this
    var url = config.deletebucket
    console.log(proId)
    var param = {
      productId: proId,
      orderType:64
    }

    httpTool.postloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        if (onSuccess instanceof Function) {
          onSuccess(res)
        }

      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        com.showToast('删除购物车商品失败')        
      }
    )
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
    this.setData({orderAmount:0,allchecked:false,checkedlength:0})
    this.login()    
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