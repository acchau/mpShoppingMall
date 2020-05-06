// pages/upgrade/signagree/signagree.js
var com = require("../../../pages/httpTool/com.js");
var httpTool = require("../../../pages/httpTool/httpTool.js");
var datetime = require("../../../utils/timeUtil.js");
var config = require("../../../pages/httpTool/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal: '',
    // time: datetime.now(),
    // checked:false,
    // btnshow:true
  },

    /**
   * 下一步操作
  */
 next(){
    var that=this  
    httpTool.postloginRequest(config.upprotocol, {}, com.onStart
    ,function(res){      
      wx.navigateTo({
        url: '../product/product',
      })
    }
    ,function(res){      
      com.showToast(res.message)
    })
  },

  /**
   * 获取签订协议信息
  */
  getprotocol(){
    let key = wx.getStorageSync('number') + 'upsignagree'
    let person = wx.getStorageSync(key)
    if (!person){
      var that = this
      var url = config.upprotocol
      httpTool.getloginRequest(url, {}, com.onStart
      ,function(res){                
        wx.setStorageSync(key, res.body)
        that.setData({ personal: res.body })
      }
      ,function(res){        
        com.showToast(res.message)
      })
    }else{
      this.setData({ personal: person })
    }
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getprotocol()
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