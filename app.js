//app.js
var app = getApp();
App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
  },
  globalData: {
    userInfo: null,
    token: null,
    session_key: null,
    appid: 'wx4d256cf6c5b4ecd0',
    secret: 'c4904a87f6bbc23c9b069c99495ca230'
  },
  //basePath: "http://localhost:8080",
  basePath: "http://mall.wakakaljh.top",
})
