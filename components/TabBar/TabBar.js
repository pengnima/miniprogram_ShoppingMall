// components/TabBar/TabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      default: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleTabClick(e) {
      let { index } = e.currentTarget.dataset;

      //将index发送给父组件
      this.triggerEvent("TabClickEvent", { index });
    },
  },
});
