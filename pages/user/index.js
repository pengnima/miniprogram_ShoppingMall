// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIuse: wx.canIUse("button.open-type.getUserInfo"),
    userInfo: null,
    collectsNum: 0,
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
    let userInfo = wx.getStorageSync("userInfo") || null;
    let collects = wx.getStorageSync("collects") || [];
    this.setData({
      userInfo,
      collectsNum: collects.length,
    });

    console.log(this.data.userInfo);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 事件函数
   */
  handleGetUser(e) {
    console.log(e);

    let userInfo = e.detail.userInfo || null;

    if (userInfo != null) {
      this.setData({
        userInfo,
      });
      wx.setStorageSync("userInfo", userInfo);
    }
  },
});
