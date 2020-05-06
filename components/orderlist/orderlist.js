// components/orderlist/orderlist.js
Component({

  options:{
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    orderList:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _orderdetail(e){
      this.triggerEvent('orderdetail',e)
    },
    _payment(e){
      this.triggerEvent('payment',e)
    }
  }
})
