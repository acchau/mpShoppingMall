var httpTool = require("pages/httpTool/httpTool.js");
var config = require("pages/httpTool/config.js");

import systemInfoUtil from 'utils/systemInfoUtil.js'

App({
  onLaunch: function () {
    systemInfoUtil.init()
  },

  globalData: {
    userInfo: null,
    sysInfo:systemInfoUtil
  }
})