// pages/createaddress/createaddress.js

var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: "",
    showAreaList: false,

    nameMsg: '',
    phonemsg: '',
    areaMsg: '',
    areaChooseCodeMsg: '',
    postalcodemsg: '',

    personal: {}
  },

/**
 * 获取输入框的值
*/
  onNChange(e) { this.setData({ ['personal.name']: e.detail }) },
  onPChange(e) { this.setData({ ['personal.phone']: e.detail }) },
  onAChange(e) { this.setData({ ['personal.areadetail']: e.detail }) },
  onPostalChange(e) { this.setData({ ['personal.postalcode']: e.detail }) },


  /**
   * 失去焦点触发
  */
  onNBlur(e) {
    let v = e.detail.value
    if (v) {
      if (!(/^[\u4e00-\u9fa5]{2,10}$/.test(v))) {
        this.setData({ nameMsg: '真实姓名2-10个中文字符' })
        return
      } else {
        this.setData({
          nameMsg: '',
          ['personal.name']: v
        })
      }
    } else {
      this.setData({ nameMsg: '' })
    }
  },

  onPBlur(e) {
    var that = this
    let v = e.detail.value
    if (v) {
      if (!(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(v))) {
        that.setData({ phonemsg: '手机号码格式有误' })
        return
      } else {
        that.setData({
          phonemsg: '',
          ['personal.phone']: v
        })
      }
    } else {
      that.setData({ phonemsg: '' })
    }

  },

  onABlur(e) {
    let v = e.detail.value
    if (v) {
      if (!(/^[\u4E00-\u9FA5A-Za-z0-9_-]{0,50}$/.test(v))) {
        this.setData({ areaMsg: '详细地址不能超过50个长度' })
        return
      } else {
        this.setData({
          areaMsg: '',
          ['personal.areadetail']: v
        })
      }
    } else {
      this.setData({ areaMsg: '' })
    }
  },

  onPostalBlur(e) {
    let v = e.detail.value
    if (v) {
      if (!(/^[0-8][0-7]\d{4}$/.test(v))) {
        this.setData({ postalcodemsg: '邮政编码格式有误' })
        return
      } else {
        this.setData({
          postalcodemsg: '',
          ['personal.postalcode']: v
        })
      }
    } else {
      this.setData({ postalcodemsg: '' })
    }
  },

  /**
   * 控制显示地区选择
  */
  onAreaLisClose() {
    this.setData({ showAreaList: false })
  },

  onArea() {
    this.setData({ showAreaList: true })
  },

  areaconfirm(e) {
    console.log(e.detail.values[2])
    var areaChooseList = e.detail.values;
    var areaNameList = []
    for (let o of areaChooseList) {
      areaNameList.push(o.name)
    }

    this.setData({
      showAreaList: false,
      areaChooseCodeMsg: '',
      ['personal.areaChoose']: areaNameList.join(' '),
      ['personal.areaChooseCode']: areaChooseList[2].code
    })
  },

  areacancel() {
    this.setData({
      showAreaList: false
    })
  },

  /**
   * 获取地区数据
  */
  getAreaList() {

    let areaList = wx.getStorageSync("areaList")
    if (areaList) {
      this.setData({ areaList: areaList })
      return;
    }

    var that = this
    var url = config.area
    var param = {}
    httpTool.getRequest(url, param, com.onStart
      , function (res) {

        wx.hideLoading()
        var province = JSON.parse(res.body.province_list)
        var city = JSON.parse(res.body.city_list)
        var county = JSON.parse(res.body.county_list)

        that.setData({
          ['areaList.province_list']: province,
          ['areaList.city_list']: city,
          ['areaList.county_list']: county
        })

        wx.setStorageSync("areaList", that.data.areaList)

      }
      , function (res) {
        wx.hideLoading()
        console.log(res)
        com.showToast(res.message)        
      })
  },

  /**
   * 设置为默认地址
  */
  ondefaultChange(e){
    this.setData({
      defaultchecked: e.detail
    });
  },
  
  /**
   * 初始化修改地址信息
  */
  initaddress(){
    let maddress = wx.getStorageSync('maddress')
    if(maddress){
      this.setData({
        ['personal.id']:maddress.id, 
        ['personal.name']: maddress.recipientName,
        ['personal.phone']: maddress.tel.trim(),
        ['personal.areadetail']: maddress.streetAddress,
        ['personal.postalcode']: maddress.postalCode,
        ['personal.areaChooseCode']:maddress.cpcCode.substring(2),
        ['personal.areaChoose']:maddress.province+" "+maddress.city+" "+maddress.county,
        defaultchecked:maddress.isDefault
      }) 
      console.log(maddress)
      wx.setStorageSync('maddress','')
    }
  },

  /**
   * 保存
  */
  save() {

    var that = this
    let personal = that.data.personal
    console.log(personal.phone)
    if (!personal.name) { that.setData({ nameMsg: '收货人姓名不能为空' }); return; }
    if (!(/^[\u4e00-\u9fa5]{2,10}$/.test(personal.name))) { this.setData({ nameMsg: '真实姓名2-10个中文字符' }); return; }

    if (!personal.phone) { that.setData({ phonemsg: '收货人手机号码不能为空' }); return; }
    if (!(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(personal.phone))) {
      that.setData({ phonemsg: '手机号码格式有误' })
      return
    }

    if (!personal.areaChooseCode) { that.setData({ areaChooseCodeMsg: '请选择所属地区' }); return; }
    if (!personal.areadetail) { that.setData({ areaMsg: '详细地址不能为空' }); return; }
    if (!(/^[\u4E00-\u9FA5A-Za-z0-9_-]{0,50}$/.test(personal.areadetail))) {
      this.setData({ areaMsg: '详细地址不能超过50个长度' })
      return
    }

    if (!personal.postalcode) { that.setData({ postalcodemsg: '邮政编码不能为空' }); return; }
    if (!(/^[0-8][0-7]\d{4}$/.test(personal.postalcode))) {
      this.setData({ postalcodemsg: '邮政编码格式有误' })
      return
    }

    console.log(personal)
    console.log(this.data.defaultchecked)

    let url = config.addaddress
    if(that.data.opertype == 2){
      url = config.modifyaddress
    }

    let tempareaChooselist = personal.areaChoose.split(' ')

    let param ={
      id:personal.id,
      cpcCode:"86"+personal.areaChooseCode,
      recipientName:personal.name,
      province:tempareaChooselist[0],
      city:tempareaChooselist[1],
      county:tempareaChooselist[2],
      streetAddress:personal.areadetail,
      postalCode:personal.postalcode,
      tel:personal.phone,
      isDefault:this.data.defaultchecked
    }

    console.log(param)

    httpTool.postloginRequest(url,param,com.onStart,
      function(res){
        wx.setStorageSync(wx.getStorageSync('number')+"address", param)

        wx.redirectTo ({
          url: '../confirmorder/confirmorder'
        })
      },
      function(err){
        console.log(err)
        let errmsg = that.data.opertype == 1?"新增收货地址失败":"修改收货地址失败"
        com.showToast(errmsg)
      }
    )



  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({opertype:options.type})
    this.getAreaList()    
    this.initaddress()
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