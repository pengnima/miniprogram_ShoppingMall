## 项目总结

- 项目介绍：
  - 利用小程序开发的购物商城前端项目，用户可以直接使用小程序进行商品的浏览，搜索，购买等操作。
- 我的职责：
  - 工作大致分为**前端静态界面搭建**、**与后端交互实现动态页面**、**基础功能的逻辑处理**
  - 构建 4 大主要界面（首页，分类，购物车，用户），利用小程序 app.json 中内置的 TabBar 实现
  - 构建 7 大辅助界面（商品列表、详情、收藏、订单、搜索、意见反馈、结算）
  - 实现各个页面到商品详情页面的跳转。
  - 通过给后端发送请求来实现**搜索功能**，且利用防抖函数，减少了多次发送请求的问题。
  - 通过小程序内置的缓存，实现 **加入购物车**，**收藏商品**，以及**用户登录**等功能。
  - 为了更好地贴好小程序地风格，实现了自定义地**意见反馈**页面，并可以**上传图片**达成反馈
- 项目不足：
  - 由于非企业账户，支付结算功能无法实现，只能大概模拟。（支付界面->创建订单->预支付）
  - 由于没有独立的后台，关于**用户方面等信息**都是保存在小程序缓存里。

## 使用截图

![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(1).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(2).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(3).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(4).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(5).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(6).jpg>)
![小程序](<https://gitee.com/pengnima1/blogimage/raw/master/md/wx_shopping(7).jpg>)
