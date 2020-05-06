


export default class systemInfoUtil {
  static PC = "pc";
  static IOS = "ios";
  static ANDROID = "android";

  /**
   * 平台 ios,andorid,pc
   */
  static platform;
  /**
   * 基础库版本 已处理成数值7.0.0->700 容易比较 可以查map到微信什么版本
   */
  static wxSDKVersion;

  static init() {
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") {
          systemInfoUtil.platform = systemInfoUtil.PC;
        } else if (res.platform == "ios") {
          systemInfoUtil.platform = systemInfoUtil.IOS;
        } else if (res.platform == "android") {
          systemInfoUtil.platform = systemInfoUtil.ANDROID;
        }

        let version = res.SDKVersion;
        version = version.replace(/\./g, "");
        systemInfoUtil.wxSDKVersion = version;

        systemInfoUtil.StatusBar = res.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          systemInfoUtil.Custom = capsule;
          systemInfoUtil.CustomBar = capsule.bottom + capsule.top - res.statusBarHeight;
        } else {
          systemInfoUtil.CustomBar = res.statusBarHeight + 50;
        }

      }
    })
  }
}