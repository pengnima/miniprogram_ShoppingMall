// pages/category/index.js
import { request } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightMenuList: [],
    currIndex: 0,
    scrollTop: 0, //切换左侧时，右侧的滚动条的高度都清零
  },
  // 先将全部都存放在这里，然后等用户点击哪一个，再去将对应的右边的菜单存入 rightMenuList中
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Cates = wx.getStorageSync("cates");

    if (!Cates) {
      console.log("初次请求分类");
      this.getCates();
    } else {
      if (Date.now() - Cates.date >= 300000) {
        console.log("过期了");
        this.getCates();
      } else {
        this.Cates = Cates.cates;
        let leftMenuList = this.Cates.map(item => item.cat_name);
        let rightMenuList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightMenuList,
        });
        console.log("有缓存");
      }
    }
  },

  getCates() {
    request({
      url: `categories`,
    }).then(res => {
      this.Cates = res.data.message;
      let leftMenuList = this.Cates.map(item => item.cat_name);
      let rightMenuList = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightMenuList,
      });
      // 存入本地缓存中
      wx.setStorageSync("cates", { date: Date.now(), cates: this.Cates });
    });
  },

  /**
   * 事件函数
   */
  handleClick(e) {
    // console.log(e.currentTarget.dataset);
    let { index } = e.currentTarget.dataset;
    this.setData({
      currIndex: index,
      rightMenuList: this.Cates[index].children,
      scrollTop: 0,
    });
  },
});
