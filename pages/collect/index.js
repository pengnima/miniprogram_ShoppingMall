// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        tabName: "商品收藏",
        isActive: true,
      },
      {
        id: 1,
        tabName: "品牌收藏",
        isActive: false,
      },
      {
        id: 2,
        tabName: "店铺收藏",
        isActive: false,
      },
      {
        id: 3,
        tabName: "浏览足迹",
        isActive: false,
      },
    ],
    collects: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let collects = wx.getStorageSync("collects") || [];
    this.setData({
      collects,
    });
  },

  changeIndex(index) {
    let tabs = this.data.tabs;
    tabs.forEach((item, i) => (i === index ? (item.isActive = true) : (item.isActive = false)));

    this.setData({
      tabs,
    });
  },
  handleTabClick(e) {
    let { index } = e.detail;
    this.changeIndex(index);
  },
});
