//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    urlBase: "http://127.0.0.1:8080"
    // 声明一个环境变量在任何可以得到app这个对象的地方都可以使用app.globalData.urlBase取得其值.
    // PS: app的获取方式: var app = getApp(); 一个页面只可以使用一次这个函数,这个函数要在page外面使用
    //     具体的使用方式可以看 pages/index/index.js
  }
})