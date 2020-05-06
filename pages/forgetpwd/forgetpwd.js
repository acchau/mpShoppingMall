// pages/forgetpwd/forgetpwd.js
var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
import Dialog from '../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: '',//会员编号
    name: '',//会员名称  
    cardcode: '',//证件号码
    vcode: '',//短信验证码

    numbermsg:'',//会员编号提示语
    namemsg: '',//会员名称提示语
    cardcodemsg: '',//证件号码提示语
    vcodemsg: '',//短信验证码提示语

    logourl: config.logurl
    // time: 0, //倒计时时间
    // timeData: {},
    // btncodeshow:true,//获取验证码按钮是否显示
  },

  /**
   * 获取输入框的值
  */
  onNChange(e) {     
    if (e.detail != ''){
      this.setData({ 
        number: e.detail,
        numbermsg:'',
      }) 
    }
  },
  onAChange(e) { 
    if (e.detail != '') {
      this.setData({ 
        name: e.detail,
        namemsg:'', 
      }) 
    }
  },
  onCChange(e) { 
    if (e.detail != '') {
      this.setData({ 
        cardcode: e.detail,
        cardcodemsg: '',
      }) 
    }
  },
  onVChange(e) { 
    if (e.detail != '') {
      this.setData({ 
          vcode: e.detail,
          vcodemsg: '',  
        }) 
    }
  },

  /**
   * 倒计时
  */
  // onTChange(e){      
  //   this.setData({
  //     timeData: e.detail
  //   });        
  // },

  /**
   * 倒计时结束
  */
  // timefinished(){    
  //   this.setData({ btncodeshow: true })
  // },

  /**
   * 获取短信验证码
  */
  // getcode(){
  //   this.setData({ 
  //     btncodeshow: false,
  //     time: 60*1000,
  //   })
  // },

  /**
   * 确定按钮
  */
  confirm(){
    var that = this;

    if (that.data.number == '') { that.setData({ numbermsg: '会员编号不能为空' }); return; }
    if (that.data.name == '') { that.setData({ namemsg: '会员名称不能为空' }); return; }
    if (that.data.cardcode == '') { that.setData({ cardcodemsg: '证件号码不能为空' }); return; }
    // if (that.data.vcode == '') { that.setData({ vcodemsg: '验证码不能为空' }); return; } 

    if (!(/^[a-zA-Z]\d{1,11}$/.test(this.data.number))) { that.setData({ numbermsg: '会员编号不能超过11位' }); return; }
    if (!(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(that.data.cardcode))){
      that.setData({ cardcodemsg: '证件号码格式有误' }); return;
    }


    var url = config.forget
    var param = {
      number: that.data.number,
      name: that.data.name,
      identityCardId: that.data.cardcode
    }

    httpTool.postRequest(url, param, that.onStart,
      function (res) {
        console.log(res);
        wx.hideLoading();
        that.tip(res.message, () => {
          wx.navigateBack({
            delta: 1
            })
          });
       
      },
      function (res) {
        console.log(res);
        wx.hideLoading();
        that.tip(res.message+"，请核实填写信息是否正确",()=>{});
      }
    )
  },

  /**
 * 提示框
*/
  tip(msg,sync) {
    Dialog.alert({
      message: msg
    }).then(() => {
      // on close
      sync()
    });
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