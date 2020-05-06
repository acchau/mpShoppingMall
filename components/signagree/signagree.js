// components/signagree/signagree.js
var com = require("../../pages/httpTool/com.js");
var datetime = require("../../utils/timeUtil.js");


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    personal:{
      type:Object,
      value:{}
    },
    checked:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    time: datetime.now()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
       * 协议点击事件
      */
    agree(e){
      com.download(e.currentTarget.dataset.src)
    },

    /**
     * 勾选已阅读
    */
    onChange(e){
      this.setData({
        checked: e.detail     
      })    
    },

    _next(e){
      this.triggerEvent('next',e)
    }
  }
})
