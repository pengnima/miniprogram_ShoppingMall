/**
 * 1. 收藏
 *    1. onShow时先瞅瞅 缓存中的 收藏商品的id是否和该id一致
 *        - 是，改变商品图标
 *        - 否，不改变
 *    2. 点击商品收藏按钮
 *        - 判断该商品是否存在 缓存中，已经存在，则删除，不存在，则添加
 */

import { request, showToast } from "../../request/index.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false, //通过这个修改 收藏图标
  },
  GoodsPics: [],
  GoodsInfo: null,

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    let curPages = getCurrentPages();
    let options = curPages[curPages.length - 1].options;
    let { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  getGoodsDetail(goods_id) {
    request({
      url: `goods/detail?goods_id=${goods_id}`,
    }).then(res => {
      res = res.data.message;
      let isCollect = false;
      console.log(res);

      //存放大图图片
      res.pics.forEach(item => this.GoodsPics.push(item.pics_big));

      //存放当前商品的所有信息
      if (this.GoodsInfo == null) {
        this.GoodsInfo = res;
      }

      // 收藏相关
      let collects = wx.getStorageSync("collects") || [];
      isCollect = collects.some(v => v.goods_id == goods_id);

      this.setData({
        goodsObj: {
          pics: res.pics,
          goods_price: res.goods_price,
          goods_name: res.goods_name,
          goods_introduce: res.goods_introduce.replace(/\.webp/g, ".jpg"),
        },
        isCollect,
      });
    });
  },

  /**
   * 事件函数
   */
  handleCollectClick() {
    let user = wx.getStorageSync("userInfo") || null;
    if (user == null) {
      showToast({ title: "请登录~" });
      return;
    }
    let isCollect = false;
    let id = this.GoodsInfo.goods_id;
    let collects = wx.getStorageSync("collects") || [];
    let index = collects.findIndex(v => v.goods_id == id);
    if (index != -1) {
      //表示存在，那么要删除
      collects.splice(index, 1);
      wx.showToast({
        title: "取消成功",
        icon: "success",
        duration: 500,
        mask: true,
      });
    } else {
      collects.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        duration: 500,
        mask: true,
      });
    }
    wx.setStorageSync("collects", collects);
    this.setData({
      isCollect,
    });
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
