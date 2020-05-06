// pages/upgrade/shoppingcart/shoppingcart.js
var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shoporderAmount:0,
    minTotalMoney:0,
    allchecked:false,
    productList: [],     
    orderAmount:0, //合计金额
  },

   /**
   * 删除产品
  */
 onClose(event) {
  var that=this
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
deleteproduct(productindex){

  var initproductList=this.data.productList

  initproductList.splice(productindex,1)


  this.setData({ productList: initproductList})
 
  //重新设置注册报单产品的总数量
  let initshopcardCount = 0
  initproductList.forEach(function (item, index) {
    initshopcardCount += item.quantity
  })
  let number = wx.getStorageSync("number");
  wx.setStorageSync(number+"upshopcartlist", initproductList)
  wx.setStorageSync(number+'upshopcartcount',initshopcardCount)

  this.calcorderamount(this.data.productList)
},

/**
 * 修改产品的数量
*/
onStepChange(e){
  
  let productIndex = e.detail.currentTarget.dataset.index
  let initproductList = this.data.productList


  let product = initproductList[productIndex]    
  product.quantity=e.detail.detail

  initproductList[productIndex]=product

  this.setData({
    productList: initproductList,
  })

  this.calcorderamount(initproductList)
  
  //重新设置注册报单产品的总数量
  let initshopcardCount=0
  initproductList.forEach(function(item,index){
    initshopcardCount+=item.quantity
  })
  let number = wx.getStorageSync("number");
  wx.setStorageSync(number+"upshopcartlist", initproductList)
  wx.setStorageSync(number+'upshopcartcount',initshopcardCount)
  
},

/**
 * checkbox选中
*/
onChange(e){

  let initproductlist=this.data.productList
  let productIndex=e.detail.currentTarget.dataset.index
  let product = initproductlist[productIndex]

  product.checked = e.detail.detail
  initproductlist[productIndex]=product

  let checkedlength=0
  initproductlist.forEach(function(item,index){
    if(item.checked){
      checkedlength = checkedlength+1
    }
  })
  
  this.setData({ 
    productList: initproductlist,
    allchecked: checkedlength==initproductlist.length?true:false,
    checkedlength: checkedlength
  })
  this.calcorderamount(initproductlist)
},

/**
 * 全选按钮
*/
onAllChange(e){
  let initproductlist = this.data.productList
  let ischecked = e.detail.detail

  this.data.productList.forEach(function(item,index){
    item.checked=ischecked
    initproductlist[index] = item
  })

  this.setData({ 
    allchecked:e.detail.detail,
    productList:initproductlist,
    checkedlength: ischecked?initproductlist.length:0
  })
  this.calcorderamount(initproductlist)
},

/**
 * 提交订单
*/
onsubmit(){
  //校验订单金额是否满足
  if (this.data.minTotalMoney > this.data.shoporderAmount){
    com.showToast('订单金额未满足条件')    
    return;
  }
  
  
  let submitproductList=this.data.productList.filter(function(item){return item.checked == true})

  console.log(submitproductList)
  //跳转到提交订单页面
  let number = wx.getStorageSync('number');
  wx.setStorageSync(number+"upsubmitorder", submitproductList)

  httpTool.getloginRequest(config.getbalance,{},com.onStart,function(res){
    wx.setStorageSync(number+"upbalance", res.body);
    console.log(res)
    wx.navigateTo({
      url: '../../confirmorder/confirmorder?type=1',
    })
  },function(err){
    console.log(err)
    com.showToast(err.message)
  })
  
},

/**
 * 计算订单金额
*/
calcorderamount(productList){
  let amount=0
  let checkednum = 0
  productList.forEach(function(item,index){
    if (item.checked){
      amount += item.partnerPrice * item.quantity    
      checkednum+=1  
    }
  })
  
  this.setData({ orderAmount: amount * 100, shoporderAmount: amount,checkedlength:checkednum,allchecked:(checkednum > 0 && checkednum==productList.length  ?true:false)})
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let number = wx.getStorageSync('number');
    let upminiTotalMoney = wx.getStorageSync("upminiTotalMoney")
    let upshopcartlist = wx.getStorageSync(number+"upshopcartlist")
    let upshopcartcount = wx.getStorageSync(number+"upshopcartcount")   

    console.log(upminiTotalMoney)
    console.log(upshopcartlist)
    console.log(upshopcartcount)

    this.setData({
      productList:upshopcartlist,
      minTotalMoney:upminiTotalMoney
    })
    this.calcorderamount(this.data.productList)
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