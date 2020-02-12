var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: null,
    shopCategory: null
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    util.requestUrl({
      url: '/api/shop/getShopInfo',
      params: {
        userId: app.globalData.userInfo.id,
      },
      method: "POST"
    })
    .then(res => {
      var fdata = res.data;
      if(fdata){
        app.globalData.shopId = fdata.id
        that.setData({
          shopId: fdata.id,
          shopCategory: fdata.tShopCategory
        })
      }else{
        that.setData({
          shopId: null,
        })
      }
    })
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