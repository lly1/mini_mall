var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.basePath,
    remarks: '',
    order: ''
  },
  remarks: function(e){
    console.info(e);
    this.setData({
      remarks: e.detail.value
    })
  },
  pay: function(e){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定付款吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          util.requestUrl({
            url: '/api/order/UserPay',
            params: {
              id: that.data.order.id,
              remarks: that.data.remarks
            },
            method: "POST"
          })
          .then(res => {
            console.info(res)
            if(res.success){
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(()=>{
                wx.navigateTo({
                  url: '/pages/oderDetail/oderDetail?orderId='+res.data.id
                })
              },1000);
            }else{
              wx.showToast({
                title: res.data,
                icon: '/images/system/error.png',
                duration: 1000
              })
            }
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.requestUrl({
      url: '/api/order/getOrderById',
      params: {
        id: options.orderId,
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.setData({
        order: res.data
      })
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