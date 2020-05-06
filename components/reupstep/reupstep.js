// components/reupstep/reupstep.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active:{
      type:Number,
      value:0
    },
    steptype:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    upgradesteps: [
      {
        text: '选择升级级别'
      },
      {
        text: '签订协议'
      },
      {
        text: '选购产品'
      },
      {
        text: '完成'
      }
    ],
    registersteps: [
      {
        text: '完善个人信息'
      },
      {
        text: '签订协议'
      },
      {
        text: '选购产品'
      },
      {
        text: '完成'
      }
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
