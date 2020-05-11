/**
 * 1. 输入框绑定 值改变事件 input事件
 *    1. 获取到输入框的值
 *    2. 合法性判断
 *    3. 检验通过 把输入框的值 发送到后台
 *    4. 返回的数据打印到页面上
 *
 * 2. 微信只能单向绑定，从JS -> HTML ,所以设置了2个inputValue值
 *      inputValue为与value绑定的数据，用来在点击取消按钮之后，清空数据
 *      inpValue 是 用来传输给后台的
 */

import { request } from "../../request/index.js";
Page({
  data: {
    goods: [],
    isHidden: true,
    inputValue: "",
  },
  inpValue: "",
  pageNum: 1,
  trueFunc: null,
  total: 0,

  onLoad() {
    // 防抖外边只执行一次，里面的根据输入执行
    this.trueFunc = this.deBounce((value, count) => {
      this.getSearch(value, count);
    }, 500);
  },
  handleInput(e) {
    let { value } = e.detail;

    this.inpValue = value.trim();
    //每次输入时清空先前的数组，重置其他数
    this.setData({
      goods: [],
    });
    this.pageNum = 1;
    this.total = 0;

    if (this.data.isHidden) {
      this.setData({
        isHidden: false,
      });
    }
    if (this.inpValue.length != 0) {
      this.trueFunc(this.inpValue, this.pageNum);
    }
  },

  //发送请求
  getSearch(value, count) {
    request({
      url: `goods/search`,
      data: {
        pagenum: count,
        query: value,
      },
    }).then(res => {
      res = res.data.message;
      this.total = res.total;

      //数组接下去
      this.data.goods.push(...res.goods);

      this.setData({
        goods: this.data.goods,
      });
    });
  },

  //下拉时候，继续加载
  onReachBottom() {
    //在第一次发送请求之后，会获取total总量，然后与 goods的长度比较。
    if (this.total > this.data.goods.length) {
      ++this.pageNum;
      this.trueFunc(this.inpValue, this.pageNum);
    }
  },

  //点击取消按钮 （输入框清空）
  handleCancle() {
    this.setData({
      goods: [],
      inputValue: "",
      isHidden: true,
    });
  },

  /**
   * 防抖函数
   */
  deBounce(fn, delay) {
    let timer = null;

    return function () {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, delay);
    };
  },
});
