// pages/register/shoppingcard/shoppingcard.js
var com = require("../../../pages/httpTool/com.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allchecked:false,
    productList: [], //报单产品+保险产品
    shopproductList:[], //报单产品
    insuranceproductList:[], //保险产品
    orderAmount:0, //合计金额
    shoporderAmount:0, //报单合计金额
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
    var initshopproductList = this.data.shopproductList
    var product = initproductList[productindex]

    if (product.insurance){//删保险产品
      initproductList.pop()
      this.setData({ productList: initproductList})
      wx.setStorageSync("insuranceshopcard", initproductList)

    }else{//删注册报单产品
      
      initproductList.splice(productindex,1)
      initshopproductList.splice(productindex,1)

      this.setData({ productList: initproductList, shopproductList: initshopproductList})
      
    }

    //重新设置注册报单产品的总数量
    let initshopcardCount = 0
    initshopproductList.forEach(function (item, index) {
      initshopcardCount += item.quantity
    })

    wx.setStorageSync("shopcard", { productList: initshopproductList, shopcardcount:initshopcardCount})

    this.calcorderamount(this.data.productList)
  },

  /**
   * 修改产品的数量
  */
  onStepChange(e){
    
    let productIndex = e.detail.currentTarget.dataset.index
    let initproductList = this.data.productList
    let initshopproductList=this.data.shopproductList

    let product = initproductList[productIndex]    
    product.quantity=e.detail.detail

    initproductList[productIndex]=product
    initshopproductList[productIndex]=product
    this.setData({
      productList: initproductList,
      shopproductList: initshopproductList
    })

    this.calcorderamount(initproductList)
    
    //重新设置注册报单产品的总数量
    let initshopcardCount=0
    initshopproductList.forEach(function(item,index){
      initshopcardCount+=item.quantity
    })

    wx.setStorageSync("shopcard", { 
      productList: initshopproductList, 
      shopcardcount:initshopcardCount
    })

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
      allchecked: checkedlength==initproductlist.length?true:false
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
      productList:initproductlist
    })
    this.calcorderamount(initproductlist)
  },

  /**
   * 提交订单
  */
  onsubmit(){
    //校验订单金额是否满足
    if (this.data.shopAttr.minTotalMoney > this.data.shoporderAmount){
      com.showToast('订单金额未满足条件')      
      return;
    }
    
    let insuranceProduct='' //保险产品
    let submitproductList=[] //选择的产品
    this.data.productList.forEach(function(item,index){
      if(item.checked){
          submitproductList.push(item)
        if (item.insurance){
          insuranceProduct=item
        }
      }
    })

    //校验是否选择了俱乐部产品(客户选择了永久续约)
    if (this.data.shopAttr.isJoinedInsurance && !insuranceProduct){
      com.showToast('未选择俱乐部产品')      
      return
    }

    //跳转到提交订单页面
    wx.setStorageSync("suborder", submitproductList)
    wx.navigateTo({
      url: '../confirmorder/confirmorder',
    })

    
  },

  /**
   * 计算订单金额
  */
  calcorderamount(productList){
    let amount=0
    let shopAmount=0
    let checkedlength = 0
    productList.forEach(function(item,index){
      if (item.checked){
        checkedlength+=1
        if(!item.insurance){
          shopAmount += item.partnerPrice * item.quantity
          amount += item.partnerPrice * item.quantity
        }else{
          amount += item.preferentialPrice * item.quantity
        }
      }
    })
    
    this.setData({ orderAmount: amount * 100, shoporderAmount: shopAmount, checkedlength: checkedlength})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shopcard = wx.getStorageSync("shopcard")
    let ishopcard = wx.getStorageSync("insuranceshopcard")
    let shopAttr = wx.getStorageSync("shopattr")

    console.log(shopAttr)
    console.log(shopcard.productList)
    let allproductList = []
    if (shopAttr.isJoinedInsurance && ishopcard.length>0){
      allproductList=shopcard.productList.concat(ishopcard)
      this.setData({ insuranceproductList: ishopcard})
    }else{
      allproductList = shopcard.productList
    }

    this.setData({
      productList:allproductList,
      shopproductList: shopcard.productList,      
      shopAttr: shopAttr
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.calcorderamount(this.data.productList)
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