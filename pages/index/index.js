//Page Object
import { request } from "../../request/index.js";
// https://api-hmugo-web.itheima.net/api/public/v1/home/catitems
Page({
  data: {
    swiperList: [],

    catesList: [],

    floorList: [],
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList(); // 获取轮播图数据

    this.getCatesList(); // 获取导航数据

    this.getFloorList(); // 获取楼层数据
  },

  //请求方法
  getSwiperList() {
    request({ url: `home/swiperdata` }).then(res => {
      res = res.data.message;
      console.log(res);
      res.forEach(v => {
        v.navigator_url = v.navigator_url.match(/\?(.+)$/)[1];
      });

      this.setData({
        swiperList: res,
      });

      // 要使用data里的数据，必须 this.data
      // console.log(this.data.swiperList);
    });
  },
  getCatesList() {
    request({
      url: `home/catitems`,
    }).then(res => {
      res = res.data;

      if (res.meta.status == 200) {
        this.setData({
          catesList: res.message,
        });
      }
    });
  },

  getFloorList() {
    request({
      url: `home/floordata`,
    }).then(res => {
      res = res.data.message;
      console.log(res);
      res.forEach(v => {
        v.product_list.forEach(v1 => {
          v1.navigator_url = v1.navigator_url.replace(/^(.+)\?/, "$1/index?");
        });
      });

      this.setData({
        floorList: res,
      });
    });
  },
});
