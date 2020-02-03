//app.js
var app = getApp();
App({
  onLaunch: function() {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log(latitude, longitude)
        // wx.request({
        //   url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
        //   method: "get",
        //   success: function (res) {     
        //     console.log(res.data.result.formatted_address)
        //     wx.setStorageSync('location', res.data.result.formatted_address.substr(res.data.result.formatted_address.indexOf('市') + 1, 10))
        //   }
        // })
      }
    });
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },
  globalData: {
    userInfo: null,
    token:null,
    session_key:null,
    appid: 'wx4d256cf6c5b4ecd0',
    secret: 'c4904a87f6bbc23c9b069c99495ca230'
  },
  //basePath: "http://localhost:8080/",
  basePath: "http://192.168.2.100:8080/",

})
