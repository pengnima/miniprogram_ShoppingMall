// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img_src: {
      type: String,
      default: "",
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
    handleDelete() {
      this.triggerEvent("ImgDeleteEvent");
    },
    handlePreView() {
      this.triggerEvent("PreViewEvent");
    },
  },
});
