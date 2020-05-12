import { request } from "../../request/index.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        tabName: "综合",
        isActive: true,
      },
      {
        id: 1,
        tabName: "销量",
        isActive: false,
      },
      {
        id: 2,
        tabName: "价格",
        isActive: false,
      },
    ],
    goodsList: [],
    total: null,
  },
  QueryParames: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.QueryParames.cid = options.cid || "";
    this.QueryParames.query = options.query || "";

    this.getGoodsList(); // 获取 商品数据
  },

  getGoodsList() {
    request({
      url: "goods/search",
      data: this.QueryParames,
    }).then(res => {
      res = res.data.message;
      if (this.data.total == null) {
        this.setData({
          total: res.total,
        });
        console.log("给予total数值", this.data.total);
      }

      this.data.goodsList.push(...res.goods);
      this.setData({
        goodsList: this.data.goodsList,
      });

      // 下拉刷新
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 事件函数
   */
  handleTabClick(e) {
    let { index } = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((item, i) => (i === index ? (item.isActive = true) : (item.isActive = false)));

    this.setData({
      tabs,
    });
  },
  //滚轮上拉触碰底部
  onReachBottom() {
    if (this.data.goodsList.length >= this.data.total) {
      console.log("没数据了，回去");
      wx.showToast({
        title: "已经到底了~",
        duration: 1000,
      });
      return;
    }

    this.QueryParames.pagenum++;
    this.getGoodsList();
    console.log("数据加载");
  },

  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
      total: null,
    });
    this.QueryParames.pagenum = 1;
    this.getGoodsList();

    console.log("重新刷新");
  },
});
