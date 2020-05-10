import {
  getSetting,
  openSetting,
  chooseAddress,
  showModal,
  showToast,
} from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    allChecked: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  onShow: function () {
    //地址相关
    let address = wx.getStorageSync("address");

    this.setData({
      address,
    });

    //购物车信息相关

    let cart = wx.getStorageSync("cart") || [];

    this.setCart(cart, false);
  },
  /**
   * 事件
   */
  //选择地址，网络相关
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

  // 切换checked
  handleChangeChecked(e) {
    let { id } = e.currentTarget.dataset;
    let cart = this.data.cart;
    let index = cart.findIndex(v => v.goods_id == id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  // 所有都切换
  handleAllChecked(e) {
    let { allChecked, cart } = this.data;
    cart.forEach(v => {
      v.checked = !allChecked;
    });
    this.setCart(cart);
  },

  //增加购买数
  handleChangeCount(e) {
    let { id, operation } = e.currentTarget.dataset;
    let cart = this.data.cart;

    let index = cart.findIndex(v => v.goods_id == id);

    //购买数变为0，弹窗是否要删除

    if (cart[index].count == 1 && operation == -1) {
      showModal({ content: "是否要移除该商品" }).then(res => {
        if (res.confirm) {
          cart.splice(index, 1);
          this.setCart(cart);
        }
      });
    } else {
      cart[index].count += operation;
      this.setCart(cart);
    }
  },

  //结算
  handlePay(e) {
    let { totalNum, address } = this.data;
    if (totalNum == 0) {
      showToast({ title: "请选择要购买的商品" });
      return;
    }
    if (Object.keys(address).length == 0) {
      showToast({ title: "请选择收货地址" });
      return;
    }
    wx.navigateTo({
      url: "/pages/pay/index",
      success: result => {},
    });
  },

  // 设置购物车 结算栏
  setCart(cart, isset = true) {
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = cart.length == 0 ? false : true;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.count;
        totalNum += v.count;
      } else {
        allChecked = false;
      }
    });
    totalPrice = Math.round(totalPrice * 100) / 100;
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked,
    });
    if (isset) {
      wx.setStorageSync("cart", cart);
    }
  },
});
