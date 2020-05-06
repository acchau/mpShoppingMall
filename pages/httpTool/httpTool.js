
var com = require("../httpTool/com.js")
var cache = require('../../utils/cache.js');

/**
 * 注册post请求调用
*/
function regpost(url, params, onStart, onSuccess, onFailed){
  regrequest(url, params, "POST", onStart, onSuccess, onFailed)
}

/**
 * 注册get请求调用
*/
function regget(url, params, onStart, onSuccess, onFailed) {
  regrequest(url, params, "GET", onStart, onSuccess, onFailed)
}

/**
 * 登录post请求调用
*/
function loginpost(url, params, onStart, onSuccess, onFailed) {
  loginrequest(url, params, "POST", onStart, onSuccess, onFailed)
}

/**
 * 登录get请求调用
*/
function loginget(url, params, onStart, onSuccess, onFailed) {
  loginrequest(url, params, "GET", onStart, onSuccess, onFailed)
}




/**
 * 注册request请求调用
*/
function regrequest(url, params, method, onStart, onSuccess, onFailed){
 
  if (!cache.getCache('reginfo')){    
    wx.navigateTo({
      url: '../../register/verifycode/verifycode',
    })
  }else{
    request(url, params, { authorization: 'Bearer ' + cache.getCache('reginfo').accessToken }, method, onStart, onSuccess
    ,function(res){
      if(res.code==401){ //token过去，直接调到注册的最初页面(获取验证码界面)
        wx.hideLoading()
        wx.showToast({
          title: res.message,
          icon:'none',
          duration:5000
        })

        wx.navigateTo({
          url: '../../register/verifycode/verifycode',
        })
      }else{
        onFailed(res)
      }
    } );
  }
}

/**
 * 登录request请求调用
*/
function loginrequest(url, params, method,onStart, onSuccess, onFailed) {
  request(url, params, { authorization: 'Bearer ' + cache.getCache('userinfo').accessToken }, method, onStart, onSuccess
    , function (res) {
      if (res.code == 401) { //token过去，直接调到注册的最初页面(获取验证码界面)
        wx.hideLoading()
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 5000
        })

        wx.navigateTo({
          url: '../login/login',
        })
      } else {
        onFailed(res)
      }
    });
}

/**
 * 供外部post请求调用
 */
function post(url, params,onStart, onSuccess, onFailed) {
  request(url, params,null, "POST", onStart, onSuccess, onFailed);
}

/**
 * 供外部get请求调用
 */
function gets(url, params, onStart, onSuccess, onFailed) {
  request(url, params, null, "GET", onStart, onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onStart 开始请求,初始加载loading等处理
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */
function request(url, params, header,method, onStart, onSuccess, onFailed) {
  wx.showLoading({title: '正在加载',})
  onStart(); //request start  
  wx.request({
    url: url,
    data: dealParams(params),
    method: method,
    header: dealheader(header),
    success(res) {           
      if (res) {
        /** start 根据需求 接口的返回状态码进行处理 */
        if (res.data.code == 0) {
          onSuccess(res.data); //request success
        } else {
          onFailed(res.data); //request failed
        }
        /** end 处理结束*/
      }
    },

    fail(error) { //failure for other reasons
      console.log(error)
      wx.showToast({
        title: '不小心走丢了，请联系管理员',
        icon: 'none',
        duration: 5000
      }) 
    },
    complete(e){
       wx.hideLoading()
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}

function dealheader(data){
  return com.objmerge({ 'content-type': 'application/json' },data)
}

module.exports = {
  postRequest: post,
  getRequest: gets,

  getregRequest: regget,
  postregRequest:regpost,

  getloginRequest:loginget,
  postloginRequest:loginpost
}
