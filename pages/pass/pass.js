var meheight = 0;
var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pass: '', //获取到的手机栏中的值
    success: false,
  },

  return_home: function (e) {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  handleInputPass: function (e) {
    this.setData({
      pass: e.detail.value
    })
  },
  submit: function (e) {
    var that = this
    var pass = that.data.pass;
    if (pass == '') {
      wx.showToast({
        title: '请输入密码',
        image: '/images/system/error.png',
        duration: 2000
      })
      return;
    }else if (pass.trim().length != 6 || !/^[0-9]{6}$/.test(pass)) {
      wx.showToast({
        title: '格式不正确',
        image: '/images/system/error.png',
        duration: 2000
      })
      return;
    }
    else {
      util.requestUrl({
        url: '/api/user/setPass',
        params: {
          id: app.globalData.userInfo.id,
          pass: pass
        },
        method: "POST"
      })
      .then(res => {
        wx.showToast({
          title: '提交成功~',
          icon: 'loading',
          duration: 1000
        })
        app.globalData.userInfo = res.data;
        that.setData({
          success: true
        })
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
 
  }
})