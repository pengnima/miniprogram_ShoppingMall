/**
1. 点击 + 触发tap点击事件
    1. 触发小程序内置的 选图片的API
    2. 获取到 图片的路径 数组格式
    3. 把图片路径 存到 data变量
    4. 页面根据 图片数组 循环渲染
 */
import { showToast } from "../../request/index.js";
Page({
  data: {
    tabs: [
      {
        id: 0,
        tabName: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        tabName: "商品、商家投诉",
        isActive: false,
      },
    ],
    imgs: [],
    inpValue: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  //选择 tab栏 事件
  handleTabClick(e) {
    let { index } = e.detail;
    let tabs = this.data.tabs;
    tabs.forEach((item, i) => (i === index ? (item.isActive = true) : (item.isActive = false)));

    this.setData({
      tabs,
    });
  },

  //点击上传图片按钮
  handleUpImgClick(e) {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        this.setData({
          imgs: [...this.data.imgs, ...res.tempFilePaths],
        });
      },
      fail: () => {},
      complete: () => {},
    });
  },
  handleInput(e) {
    this.setData({
      inpValue: e.detail.value,
    });
  },
  handleSubmitClick(e) {
    let value = this.data.inpValue.trim();
    if (!value) {
      showToast({ title: "输入不合法" });
      return;
    }

    //上传图片
    let { imgs } = this.data;
    wx.showLoading({
      title: "正在上传",
      mask: true,
    });

    let count = 0;
    imgs.forEach(v => {
      wx.uploadFile({
        url: "https://img.coolcr.cn/api/upload",
        filePath: v,
        name: "image",
        success: res => {
          let url = JSON.parse(res.data).data.url;
          console.log(url);

          count++;
          if (count == imgs.length) {
            console.log("已经上传完毕");
            wx.hideLoading();
            this.setData({
              imgs: [],
              inpValue: "",
            });
            wx.navigateBack({
              delta: 1,
            });
          }
        },
        fail(err) {
          console.log(err);
        },
      });
    });
  },

  // 传递事件
  ImgDeleteEvent(e) {
    let { index } = e.currentTarget.dataset;

    let { imgs } = this.data;
    imgs.splice(index, 1);
    this.setData({
      imgs,
    });
  },
  PreViewEvent(e) {
    let { index } = e.currentTarget.dataset;

    let { imgs } = this.data;

    wx.previewImage({
      current: imgs[index],
      urls: imgs,
    });
  },
});
