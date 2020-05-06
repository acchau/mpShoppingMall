// pages/addresslist/addresslist.js

var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresslist:[]
  },



  onChange(e) {

    com.onStart()

    let addressindex = e.currentTarget.dataset.index
    let address = this.data.addresslist[addressindex]

    if (!address.checked) {
      let initaddresslist = this.data.addresslist.map(function (item, index) {
        item.checked = false
        return item
      })

      address.checked = true
      initaddresslist[addressindex] = address

      this.setData({
        addresslist: initaddresslist
      })
      
      wx.setStorageSync(wx.getStorageSync('number')+"address", address)
    }
    
    //跳转到订单页面
    wx.redirectTo({
      url: '../confirmorder/confirmorder',
    })

   
  },

  /**
   * 新增收货地址
  */
  createadress(){
    wx.redirectTo({
      url: '../createaddress/createaddress?type=1',
    })
  },

  /**
   * 修改地址
  */
  modifyadress(e){
    let addressindex = e.currentTarget.dataset.index
    let modifyaddress = this.data.addresslist[addressindex]
    
    wx.setStorageSync('maddress', modifyaddress)
    wx.redirectTo({
      url: '../createaddress/createaddress?type=2',
    })

  },

  /**
   * 获取地址列表
  */
  getaddresslist(){
    var that = this
    var url = config.getaddresslist
    var param = {
     
    }

    httpTool.getloginRequest(url, param, com.onStart,
      function (res) {
        console.log(res);
        
        let choseaddress = wx.getStorageSync('address')
        console.log(choseaddress)
        let tempaddresslist = res.body.map(function(item){
          if(item.cpcCode == choseaddress.cpcCode){
            item.checked = true
          }
          return item
        })

        wx.hideLoading();
        that.setData({
          addresslist: tempaddresslist
        })

      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        com.showToast('获取收货地址信息失败')
      }
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getaddresslist()
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