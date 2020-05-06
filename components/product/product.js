// components/product/product.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productList:{
      type:Object,
      value:{}
    },
    isLogin:{
      type:Boolean,
      value:false
    },    
    shopcardcount:{
      type:Number,
      value:0
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
    _goshoppingcard(e){
      this.triggerEvent("goshoppingcard",e)
    },
    _addshopcard(e){
      this.triggerEvent("addshopcard",e)
    }
  }
})
