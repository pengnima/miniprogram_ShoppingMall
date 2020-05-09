const REQUEST_URL = "https://api-hmugo-web.itheima.net/api/public/v1/";

let ajaxCount = 0; // 计数用，避免多次请求时，第一个请求完成就关闭弹窗

// 显示加载的弹窗，在每次请求之前调用，请求完毕之后关闭
export const request = parames => {
  ajaxCount++;
  wx.showLoading({
    title: "正在加载",
    mask: true,
  });
  return new Promise((resolve, reject) => {
    wx.request({
      ...parames,
      url: REQUEST_URL + parames.url,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      },
      complete: () => {
        ajaxCount--;
        if (ajaxCount === 0) {
          wx.hideLoading();
        }
      },
    });
  });
};

//获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: result => {
        resolve(result);
      },
      fail: () => {
        reject();
      },
    });
  });
};

//打开用户设置
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: result => {
        resolve(result);
      },
      fail: () => {
        reject();
      },
    });
  });
};

//获取用户地址
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: result => {
        // 获取成功后添加进入
        wx.setStorageSync("address", result);
        resolve(result);
      },
      fail: () => {
        reject();
      },
    });
  });
};
