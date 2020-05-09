import { getSetting, openSetting, chooseAddress } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow: function () {
    //地址相关
    let address = wx.getStorageSync("address");
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    this.setData({
      address,
    });

    //购物车信息相关
    let tempCart = wx.getStorageSync("cart");
    if (tempCart.length != 0) {
      let cart = [];
      tempCart.forEach(item => {
        cart.push({
          goods_id: item.goodsInfo.goods_id,
          goods_name: item.goodsInfo.goods_name,
          goods_price: item.goodsInfo.goods_price,
          goods_big_logo: item.goodsInfo.goods_big_logo,
          count: item.count,
        });
      });

      this.setData({
        cart,
      });
    }
  },
  /**
   * 事件
   */
  handleChooseAddress() {
    //1. 先获取用户设置。（第一次只能是 undefined）
    getSetting().then(res => {
      let scopeAddress = res.authSetting["scope.address"];

      //2. 获取 用户收获地址（会弹出 获取权限的弹窗，点击确认 即可获取权限，点取消，那么scopeAddress下次进来就是false了）
      // 进入用户收获地址之后，再点击 同意，即可获取地址
      if (scopeAddress == true || scopeAddress == undefined) {
        chooseAddress().then(res => {
          console.log("同意权限，并获取地址", res);
        });
      } else {
        // 当用户之前拒绝开启权限，又想使用获取地址，那么诱导用户打开权限
        openSetting().then(res => {
          if (res.authSetting["scope.address"]) {
            chooseAddress().then(res => {
              console.log("打开权限，并获取了地址", res);
            });
          }
        });
      }
    });
  },
});
