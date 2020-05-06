// pages/confirmorder/confirmorder.js

var httpTool = require("../../pages/httpTool/httpTool.js");
var config = require("../../pages/httpTool/config.js");
var com = require("../../pages/httpTool/com.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    checked: false,
    secondShow: false,
    errsecondpwdMsg: "",
    secondpwd: "",    
  },

  /**
   * 新增收货地址
   */
  createadress() {
    wx.navigateTo({
      url: "../createaddress/createaddress?type=1",
    });
  },

  /**
   * 收货地址列表
   */
  addresslist() {
    wx.navigateTo({
      url: "../addresslist/addresslist",
    });
  },

  /**
   * onSecondClose 二级密码关闭事件
   */
  onSecondClose(e) {
    this.setData({
      secondShow: false,
      checked: false,
    });
  },

  /**
   * 获取二级密码
   */
  secondpwdBlur(e) {
    this.setData({ secondpwd: e.detail.value });
  },

  /**
   * onSecondClose 二级密码确认事件
   */
  onSecondConfirm(e) {
    if (!this.data.secondpwd) {
      this.setData({
        errsecondpwdMsg: "二级密码不能为空",
        secondShow: true,
      });
    } else {
      let that = this;
      let url = config.secondpwd;
      console.log({ param: that.data.secondpwd });
      httpTool.postloginRequest(
        url,
        { param: that.data.secondpwd },
        com.onStart,
        function (res) {
          wx.hideLoading();
          //先在界面上扣减电子币显示给用户看
          let totalamount = that.data.totalAmount / 100;
          let showshoppoint = 0;

          if (that.data.yssuborder.electronicMoneyBalance > 0) {
            totalamount =
              totalamount - that.data.yssuborder.electronicMoneyBalance;
            showshoppoint =
              totalamount > 0
                ? 0
                : that.data.yssuborder.electronicMoneyBalance -
                  that.data.totalAmount / 100;
          }

          that.setData({
            checked: true,
            totalAmount: (totalamount > 0 ? totalamount : 0) * 100,
            showshoppoint: showshoppoint,
            secondShow: false,
          });
        },
        function (res) {
          wx.hideLoading();
          com.showToast(res.message);
          that.setData({
            secondShow: true,
          });
        }
      );
    }
  },

  /**
   * 提交订单
   */
  onsubmit(e) {
    var that = this;
    let address = that.data.address;

    if (!address) {
      com.showToast('收货地址不能为空')      
      return
    }

    com.getWXCode(function (code) {
      let bucketList = [];
      let ordertype = that.data.yssuborder.ordertype 
      that.data.productList.forEach(function (item, index) {
        bucketList.push({ productId: item.productID, quantity: item.quantity,orderType: ordertype});
      });

      let url = ordertype == 64?config.yunshangOrdersubmit:config.upgradesubmit;
      
      let ebalance = that.data.yssuborder.electronicMoneyBalance;
      let emoney =
        that.data.orderAmount > ebalance ? ebalance : that.data.orderAmount;
      let param = {
        buckets: bucketList,
        cpcCode: address.cpcCode,
        address: address.streetAddress,
        consignee: address.recipientName,
        phone: address.tel,
        postalCode: address.postalCode,
        wxCode: code,
        isUseElectronic: that.data.checked,
        usingElectronicMoney: that.data.checked ? emoney : 0,
        secondaryPassword: that.data.secondpwd,
        orderType: ordertype,
      };

      console.log(param);
      //提交订单
      httpTool.postloginRequest(
        url,
        param,
        com.onStart,
        function (res) {
          //wx.hideLoading();
          //发起支付
          com.payment(res.body,ordertype);
        },
        function (res) {
          //wx.hideLoading();
          console.log(res);
          com.showToast(res.message);
        }
      );
    });
  },

  /**
   * 判断是否使用购物积分
   */
  onChange(e) {
    let that = this;
    if (!e.detail && that.data.yssuborder.electronicMoneyBalance > 0) {
      let totalamount = that.data.totalAmount / 100;
      let showshoppoint = 0;
      totalamount = that.data.orderAmount;
      showshoppoint = that.data.yssuborder.electronicMoneyBalance;

      this.setData({
        totalAmount: (totalamount > 0 ? totalamount : 0) * 100,
        showshoppoint: showshoppoint,
      });
    }

    this.setData({
      secondShow: e.detail,
      checked: e.detail,
      errsecondpwdMsg: "",
      secondpwd: "",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let yssuborder = {}
    let level = wx.getStorageSync('level')
    let opertype = options.type || wx.getStorageSync("upjumptype")
    if((level == "健康顾问" || level =="VIP") && opertype){ //升级代理
      
      wx.setStorageSync("upjumptype",opertype)
      let number = wx.getStorageSync('number');
      yssuborder.freight = 0
      yssuborder.products = wx.getStorageSync(number+"upsubmitorder")      
      yssuborder.electronicMoneyBalance = wx.getStorageSync(number+"upbalance")
      
      let amount = 0
      let pv = 0
      yssuborder.products.forEach(function(item,index){
        amount += item.partnerPrice * item.quantity  
        pv += item.preferentialPV * item.quantity
      })

      yssuborder.totalPv = pv
      yssuborder.totalMoney =amount
      yssuborder.ordertype = 18
           
    }else{ //云商进货
      yssuborder= wx.getStorageSync("yssuborder");
      yssuborder.ordertype = 64
    }
    console.log(yssuborder)
    this.setData({
      yssuborder: yssuborder,
      productList: yssuborder.products,
      showshoppoint: yssuborder.electronicMoneyBalance,
    });

    this.setData({
      orderAmount: yssuborder.totalMoney,
      totalAmount: yssuborder.totalMoney * 100,
      amountPV: yssuborder.totalPv,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({address:''})
    let addresskey = wx.getStorageSync("number") + "address"
    if (wx.getStorageSync(addresskey)) {
      this.setData({
        address: wx.getStorageSync(addresskey),
      });
    } else {
      httpTool.getloginRequest(
        config.getaddresslist,
        {},
        com.onStart,
        (res) => {         
          if (res.body.length > 0) {
            let address =
              res.body.filter((v) => v.isDefault).length > 0
                ? res.body.filter((v) => v.isDefault)[0]
                : res.body[0];

            wx.setStorageSync(addresskey,address);
            this.setData({ address: address});
          }
        },
        function (err) {         
          console.log(err)
        }
      );
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
