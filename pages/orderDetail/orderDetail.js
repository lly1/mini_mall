var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.basePath,
    order: ''
  },
  phoneShop: function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  phoneHelp: function(e){
    wx.makePhoneCall({
      phoneNumber: '18972654160',
    })
  },
  buyAgain: function (e){
    var that = this;
    wx.request({
      url: app.basePath + "/api/order/buyAgain",
      data: JSON.stringify(e.currentTarget.dataset.detail),
      method: "POST",
      header: {
        'cookie': 'JSESSIONID='+ app.globalData.token
      },
      success: function (res) {
        if(res.data.data == 'success'){
          wx.navigateTo({
            url: '/pages/menu/menu?shopId='+e.currentTarget.dataset.shopid,
          });
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var order = JSON.parse(options.order);
    that.setData({
      order: order
    })
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