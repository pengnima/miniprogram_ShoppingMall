/**
 * 1. 输入框绑定 值改变事件 input事件
 *    1. 获取到输入框的值
 *    2. 合法性判断
 *    3. 检验通过 把输入框的值 发送到后台
 *    4. 返回的数据打印到页面上
 */

import { request } from "../../request/index.js";
Page({
  data: {
    goods: [],
  },
  pageNum: 1,
  inputValue: "",
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

    this.inputValue = value.trim();
    //每次输入时清空先前的数组
    this.setData({
      goods: [],
    });
    this.pageNum = 1;
    this.total = 0;
    if (this.inputValue != "") {
      this.trueFunc(this.inputValue, this.pageNum);
    }
  },

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

  onReachBottom() {
    //在第一次发送请求之后，会获取total总量，然后与 goods的长度比较。
    if (this.total > this.data.goods.length) {
      ++this.pageNum;
      this.trueFunc(this.inputValue, this.pageNum);
    }
  },

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
