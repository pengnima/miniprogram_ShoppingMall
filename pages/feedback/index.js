// pages/feedback/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        tabName: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        tabName: "商品、商家投诉",
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  handleTabClick(e) {
    let { index } = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((item, i) => (i === index ? (item.isActive = true) : (item.isActive = false)));

    this.setData({
      tabs,
    });
  },
});
