var meheight = 0;
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mesheight: {},
    meswidth: {},
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this
    wx.getSystemInfo({
      success: function (res) {
        meheight = res.windowHeight * 0.8
        var mesaveheight = {}
        var mesavewidth = {}
        mesaveheight.height = res.windowHeight * 0.5
        mesaveheight.scroll = res.windowHeight
        mesaveheight.image = res.windowHeight * 0.25
        mesavewidth.image = res.windowWidth * 0.5 - 40
        mesaveheight.view = res.windowHeight * 0.8 * 0.5
        mesavewidth.navigatorone = res.windowWidth * 0.5 - 1
        mesavewidth.navigatortwo = res.windowWidth * 0.25
        mesavewidth.navigatortwoimage = res.windowWidth * 0.25 * 0.5 - 10
        mesavewidth.navigatorthree = res.windowWidth * 0.5
        that.setData({
          mesheight: mesaveheight,
          meswidth: mesavewidth
        })
      }
    });
    wx.login({
      success: function (res) {
        console.log('微信登录成功');
        wx.setStorageSync("js_code", res.code)
      }
    });		
  },
  userInfoHandle: function (options) {
    var that = this;
    console.log('用户数据');
    console.log(options);
    
		util.wxLogin(that);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      });
      console.info("更新用户信息")
    }  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})