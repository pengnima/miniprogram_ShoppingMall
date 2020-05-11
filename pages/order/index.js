/**
 * 1. 页面被打开时 onShow
 *    1. 获取 type 值（onShow()里没有形参，要如何获取？）
 *        1. getCurrentPages获取当前的小程序的页面栈-数组 长度最大为10
 *    2. 根据type 请求获取订单数据
 *    3. 渲染页面
 * 2. 点击不同的标题，重新发送请求来获取和渲染数据
 */
import { request } from "../../request/index.js";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        tabName: "全部",
        isActive: false,
      },
      {
        id: 1,
        tabName: "待付款",
        isActive: false,
      },
      {
        id: 2,
        tabName: "待收货",
        isActive: false,
      },
      {
        id: 3,
        tabName: "退货/退款",
        isActive: false,
      },
    ],
    orders: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow() {
    // 1. 获取页面栈，通过页面栈获取 url 中的参数
    let current = getCurrentPages();
    let { type } = current[current.length - 1].options;

    this.changeIndex(type - 1);
    this.getOrders(type);
  },
  getOrders(type) {
    request({
      url: `my/orders/all?type=${type}`,
      header: {
        Authorization: TOKEN,
      },
    }).then(res => {
      console.log(`请求${type}`, res.data.message);

      this.setData({
        orders: res.data.message.orders,
      });
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

    this.getOrders(index + 1);
  },
});
