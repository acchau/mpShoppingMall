import Dialog from '../../dist/dialog/dialog'
import systemInfoUtil from '../../utils/systemInfoUtil.js'
import Toast from '../../dist//toast/toast'

var cache = require('../../utils/cache.js')


function extend(data, dataExtend) {
  var res = {};
  for (var key in data) {
    res[key] = data[key];
  }
  for (var key in dataExtend) {
    res[key] = dataExtend[key];
  }
  return res;
}


/**
 * 删除数组中的某一个对象   
 * @array:数组    
 * @obj:需删除的对象*/
const arrRemoveObj = (array, obj) => {
  let length = array.length;
  for (let i = 0; i < length; i++) {
    if (array[i] === obj) {
      if (i === 0) {
        array.shift();
        return array;
      } else if (i === length - 1) {
        array.pop();
        return array;
      } else {
        array.splice(i, 1);
        return array;
      }
    }
  }
}

/**
* 加载显示框
*/
function onStart() {
  wx.showLoading({
    title: '正在加载',
  })
}

function showToast(msg){
  Toast(msg)
  // wx.showToast({
  //   title: msg,
  //   icon: 'none',
  //   duration: 5000
  // })
}


/**
 * 获取微信登录的code，用于微信支付
*/
function getWXCode(success){
  wx.login({
    success(res) {
      console.log(res)
      if (res.code) {
        success(res.code)
      }else{
        showToast('微信登录获取Code失败')
      }
    },
    fail(err){
      console.log(err)
      showToast('微信登录失败')
    }
  })
}

/**
  * 登录提示弹框
*/
function login(success,fail,isStop) {
  Dialog.close();
  var _userInfo = cache.getCache('userinfo')
  if (_userInfo) {      
    success(_userInfo) // 表示已登录，可以做后续的动作
  }else{
    fail() //表示未登录做后续动作
    Dialog.confirm({
      confirmButtonText: '去登陆',
      title: '提示',
      message: '您还没登录，请登录后重试'
    }).then(() => {
      //跳转到登录页面
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }).catch(() => {
      //取消
      if(!isStop){ //是否停留在界面，不停留则跳转到首页
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    });
  }
}

/**
 * 微信支付
*/
function payment(payParam,ordertype){
  let url = '/pages/success/success?resultType=success'
  if (ordertype == 18) {
    url = '/pages/upgrade/upcomplete/upcomplete'
  }
  if(payParam){
    wx.requestPayment(
      {
        'timeStamp': payParam.timeStamp,
        'nonceStr': payParam.nonceStr,
        'package': payParam.package,
        'signType': payParam.signType,
        'paySign': payParam.paySign,
        'success': function (reswx) {
          console.log(reswx)          
          wx.navigateTo({ url: url})
        },
        'fail': function (reswx) {
          console.log(reswx)
          console.log("支付失败")
          showToast('支付失败,请联系管理员')
          wx.navigateTo({ url: '/pages/success/success?resultType=warn' })
        },
        'complete': function (reswx) {
          console.log(reswx)
        }
      })
  }else{ //纯电子币支付
    wx.navigateTo({ url: url })
  }
}
/**
 * 文件下载
*/
function download(url){
  url = systemInfoUtil.platform == systemInfoUtil.PC ? url : url.replace('http://', 'https://')
  wx.downloadFile({      
    url: url,
    success: function (res) {
      const filePath = res.tempFilePath
      wx.openDocument({
        filePath: filePath,
        success: function (res) {
          console.log('打开文档成功')
        }
      })
    }
  })
}

module.exports = {
  objmerge: extend,
  arrRemove: arrRemoveObj,
  onStart: onStart,
  showToast: showToast,
  getWXCode:getWXCode,
  login:login,
  payment:payment,
  download:download
}
