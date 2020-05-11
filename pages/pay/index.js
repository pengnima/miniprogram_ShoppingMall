import { request, requestPayment } from "../../request/index.js";
const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (false) {
      let appId = "wx993212e9ba0fae06";
      let appSecret = "e12b8b49af4229613712346394b69894";
      wx.login({
        timeout: 10000,
        success: res => {
          console.log(res);
          wx.request({
            url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${res.code}&grant_type=authorization_code`,
            success: result => {
              console.log(result);
            },
            fail: () => {},
            complete: () => {},
          });
        },
        fail: () => {},
        complete: () => {},
      });
    }
  },

  onShow: function () {
    let address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];

    // 过滤 购物车中 没选中的商品
    cart = cart.filter(v => v.checked === true);

    if (cart.length == 0) {
      wx.switchTab({
        url: "/pages/cart/index",
      });
    }

    let totalPrice = 0;
    let totalNum = 0;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.count;
        totalNum += v.count;
      }
    });
    totalPrice = Math.round(totalPrice * 100) / 100;
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address,
    });
  },
  /**
   * 事件
   */

  handleOrderPay() {
    try {
      let order_price = this.data.totalPrice;
      let consignee_addr = this.data.address.all;
      let goods = [];
      this.data.cart.forEach(v => {
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.count,
          goods_price: v.goods_price,
        });
      });

      // 1. 创建订单编号
      let order_number = null;
      request({
        url: "my/orders/create",
        method: "POST",
        header: { Authorization: TOKEN },
        data: {
          order_price,
          consignee_addr,
          goods,
        },
      })
        .then(res => {
          //成功后返回订单编号
          res = res.data.message;
          order_number = res.order_number;

          //2. 创建预支付参数
          return request({
            url: "my/orders/req_unifiedorder",
            method: "POST",
            header: { Authorization: TOKEN },
            data: {
              order_number,
            },
          });
        })
        .then(res => {
          console.log("获取预支付，支付参数，", res.data.message);

          //3. 发起微信支付
          return requestPayment(res.data.message.pay);
        })
        .then(
          res => {
            console.log(res);
          },
          err => {
            // 将支付成功的商品从购物车中移除（用过滤，找出非选中的）
            let cart = wx.getStorageSync("cart");
            let newCart = cart.filter(v => !v.checked);
            wx.setStorageSync("cart", newCart);

            console.log(err); //由于非企业账号，无法支付，会失败的
            console.log("支付失败，但还是要跳转到订单页面");
            wx.navigateTo({
              url: "/pages/order/index?type=1",
            });
          }
        );
    } catch (error) {
      console.log(error);
    }
  },
});
