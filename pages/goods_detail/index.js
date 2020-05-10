import { request, showToast } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
  },
  GoodsPics: [],
  GoodsInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { goods_id } = options;
    console.log(goods_id);

    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({
      url: `goods/detail?goods_id=${goods_id}`,
    }).then(res => {
      res = res.data.message;

      //存放大图图片
      res.pics.forEach(item => this.GoodsPics.push(item.pics_big));

      //存放当前商品的所有信息
      if (this.GoodsInfo == null) {
        this.GoodsInfo = res;
      }

      this.setData({
        goodsObj: {
          pics: res.pics,
          goods_price: res.goods_price,
          goods_name: res.goods_name,
          goods_introduce: res.goods_introduce.replace(/\.webp/g, ".jpg"),
        },
      });
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 事件函数
   */
  handleCollectClick() {
    console.log("收藏了");
  },
  handleSwiperClick(e) {
    let { index } = e.currentTarget.dataset;

    wx.previewImage({
      urls: this.GoodsPics,
      current: this.GoodsPics[index],
    });
  },

  // 加入购物车
  handleAddCart() {
    let cartList = wx.getStorageSync("cart") || [];
    let is_not = true; //用这个判断是否是 空 cartList
    if (cartList.length != 0) {
      cartList.forEach(item => {
        if (item.goods_id === this.GoodsInfo.goods_id) {
          item.count++;
          is_not = false;
        }
      });
    }

    // cartList 为空数组 或者 遍历cartList也没找到对应的goodsId，说明要新增该数据
    if (is_not) {
      this.GoodsInfo.count = 1;
      this.GoodsInfo.checked = true;
      cartList.push({
        goods_id: this.GoodsInfo.goods_id,
        goods_name: this.GoodsInfo.goods_name,
        goods_price: this.GoodsInfo.goods_price,
        goods_big_logo: this.GoodsInfo.goods_big_logo,
        count: this.GoodsInfo.count,
        checked: this.GoodsInfo.checked,
      });
    }
    wx.setStorageSync("cart", cartList);

    showToast({ title: "添加成功", icon: "success", duration: 500, mask: true });
  },
});
