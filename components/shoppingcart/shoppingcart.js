// components/shoppingcart/shoppingcart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showmargintop:{
      type:Boolean,
      value:false
    },
    productList:{
      type:Object,
      value:{}
    },
    productType:{
      type:Number,
      value:0
    },
    orderAmount:{
      type:Number,
      value:0
    },
    checkedlength:{
      type:Number,
      value:0
    },
    allchecked:{
      type:Boolean,
      value:false
    },
    level: {
      type: String,
      value: ""
    },
    shoptype:{
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
    _onAllChange(e){
      this.triggerEvent("onAllChange",e)
    },
    _onsubmit(e){
      this.triggerEvent("onsubmit",e)
    },
    _onStepChange(e){
      this.triggerEvent("onStepChange",e)
    },
    _onChange(e){
      this.triggerEvent("onChange",e)
    },
    _onClose(e){
      this.triggerEvent("onClose",e)
    }
  }
})
