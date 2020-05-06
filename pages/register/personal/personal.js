// pages/register/personal/personal.js
var httpTool = require("../../../pages/httpTool/httpTool.js");
var config = require("../../../pages/httpTool/config.js");
var com = require("../../../pages/httpTool/com.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:"",
    showAreaList:false,

    nameMsg:'',
    cardMsg:'',
    directMsg:'',
    storeMsg:'',
    areaMsg:'',
    areaChooseCodeMsg:'',
    renewMsg:'',
    healthMsg:'',

    showRenew:false,
    actionsRenew: [{ name: '年缴' }, { name: '永久续约（赠送价值375元续约产品）' }],
    showHealth:false,
    actionsHealth: [{ name: '不参加' }, { name: 'B级会员' }],

    personal: {
      level: '合伙人'
    }
  },

  /**
   * 下一步
  */
  next(){
    
    var that=this
    let personal=that.data.personal

    if (!personal.name) { that.setData({ nameMsg: '真实姓名不能为空' }); return; }
    if (!personal.cardcode) { that.setData({ cardMsg: '身份证号码不能为空' }); return; }
    
    if (!personal.directShow) { that.setData({ directMsg: '推荐人不能为空' }); return;}
    if (!personal.direct) { that.setData({ directMsg: '推荐人不存在' }); return; }

    
    if (!personal.storeIdShow) { that.setData({ storeMsg: '所属店铺不能为空' }); return; }
    if (!personal.storeId) { that.setData({ storeMsg: '所属店铺不存在' }); return; }

    if (!personal.areaChooseCode) { that.setData({ areaChooseCodeMsg: '请选择所属地区' }); return; }
    if (!personal.areadetail) { that.setData({ areaMsg: '详细地址不能为空' }); return; }

    if (!personal.renew) { that.setData({ renewMsg: '请选择续约方式' }); return; }
    if (!personal.health) { that.setData({ healthMsg: '请选择健康俱乐部' }); return; }

    console.log(personal)
    console.log(that.data.phone)
    
    let insurancePlantype=0
    switch (personal.health){
      case '不参加': insurancePlantype=0;
      break;
      case 'B级会员': insurancePlantype = 2;
        break;
    }

    let contracttype = 0
    switch (personal.renew) {
      case '年缴': contracttype = 0;
        break;
      case '永久续约（赠送价值375元续约产品）': contracttype = 1;
        break;
    }

    var url = config.savepersonal
    var param={
      phone: that.data.phone,
      levelUp:4,
      direct: personal.direct,
      storeID: personal.storeId,
      cpcode: '86'+personal.areaChooseCode,
      address: personal.areadetail,
      identityNumber: personal.cardcode,
      name: personal.name,
      insurancePlanType: insurancePlantype,
      contractType: contracttype
    }

    console.log(param)
    httpTool.postregRequest(url, param, that.onStart
    ,function(res){
      console.log(res.body)
      wx.setStorageSync('signagree', res.body)
      wx.navigateTo({
        url: '../signagree/signagree?phone=' + that.data.phone,
      })
    }
    ,function(res){
      console.log(res)
      com.showToast(res.message)      
    })


  },

  /**
   * 获取输入框的值
  */
  onNChange(e) { this.setData({ ['personal.name']: e.detail }) },
  onCChange(e) { this.setData({ ['personal.cardcode']: e.detail }) },
  onDChange(e) { this.setData({ ['personal.directShow']: e.detail }) },
  onSChange(e) { this.setData({ ['personal.storeIdShow']: e.detail }) },
  onAChange(e) { this.setData({ ['personal.areadetail']: e.detail }) },

  /**
   * 失去焦点触发
  */
  onNBlur(e) {
    let v = e.detail.value
    if(v){
      if (!(/^[\u4e00-\u9fa5]{2,10}$/.test(v))) { 
        this.setData({ nameMsg: '真实姓名2-10个中文字符' })
        return
      }else{
        this.setData({ 
          nameMsg: '',
          ['personal.name']:v 
        })
      } 
    } else {
      this.setData({ nameMsg: '' })
    }
  },

  onCBlur(e){
    let v=e.detail.value
    if(v){
      if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(v))){
        this.setData({ cardMsg: '身份证号码格式有误' })
        return
      }else{
        this.setData({ 
          cardMsg: '',
          ['personal.cardcode']:v 
        })
      }
    }else{
      this.setData({cardMsg: ''})
    }

  },

  onDBlur(e){
    let v=e.detail.value
    var that=this
    if(v){
      //推荐人校验
      let url = config.existsdirect      
      var param = { param: v}
      console.log(param)
      httpTool.postregRequest(url, param, that.onStart
        ,function(res){          
          that.setData({
            ['personal.direct']:v,
            ['personal.directShow']: v+"("+res.body+")",
            directMsg:''
          })
        }
        ,function(res){
          console.log(res)
          that.setData({ directMsg:res.message})
        }
      )

    } else {
      this.setData({ directMsg: '' })
    }
  },

  onSBlur(e) {
    let v = e.detail.value
    var that = this
    if (v) {
      //店铺校验
      let url = config.existstorename
      let param = { param: v }
      console.log(param)
      httpTool.postregRequest(url, param, that.onStart
        , function (res) {
          console.log(res)
          that.setData({
            ['personal.storeId']: v,
            ['personal.storeIdShow']: v + "(" + res.body + ")",
            storeMsg:''
          })          
        }
        , function (res) {
          console.log(res)
          that.setData({ storeMsg: res.message })
        }
      )
    } else {
      this.setData({ storeMsg: '' })
    }
  },

  onABlur(e) {
    let v = e.detail.value
    if (v) {
      if (!(/^[\u4E00-\u9FA5A-Za-z0-9_]{0,50}$/.test(v))) {
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

  

  


  /**
   * 续约选择相关操作
  */
  onRenewClose(){
    this.setData({ showRenew:false})
  },

  onRenewSelect(e){
    
    this.setData({
      ['personal.renew']:e.detail.name,
      renewMsg: '',
      showRenew:false
    })
  },

  onRenew(){
    this.setData({ showRenew:true})
  },

/**
 * 健康俱乐部选择相关操作
*/
  onHealthClose() {
    this.setData({ showHealth: false })
  },

  onHealthSelect(e) {
    
    this.setData({
      ['personal.health']: e.detail.name,
      healthMsg: '',
      showHealth: false
    })
  },

  onHealth() {
    this.setData({ showHealth: true })
  },

  /**
   * 控制显示地区选择
  */
  onAreaLisClose(){
    this.setData({ showAreaList:false})
  },

  onArea(){
    this.setData({ showAreaList: true})
  },

  areaconfirm(e){
    console.log(e.detail.values[2])
    var areaChooseList = e.detail.values;
    var areaNameList=[]
    for(let o of areaChooseList){
      areaNameList.push(o.name)
    }
    
    this.setData({
      showAreaList: false,
      areaChooseCodeMsg:'',
      ['personal.areaChoose']:areaNameList.join(' '),
      ['personal.areaChooseCode']:areaChooseList[2].code
    })
  },

  areacancel(){
    this.setData({
      showAreaList: false
    })
  },

  /**
   * 获取地区数据
  */
  getAreaList(){
    var that=this
    var url = config.area
    var param={}
    httpTool.getregRequest(url, param, that.onStart
    ,function(res){
      
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
    ,function(res){
      console.log(res)
      com.showToast(res.message)     
    })
  },

  onStart(){
    wx.showLoading({
      title: '正在加载中',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAreaList()
    this.data.phone = options.phone
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