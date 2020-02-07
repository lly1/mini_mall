var meheight = 0;
var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text: '获取手机号', //按钮文字
    phone: '', //获取到的手机栏中的值
    success: false,
  },

  return_home: function (e) {
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  handleInputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      util.requestUrl({
        url: 'api/user/decodePhone',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: app.globalData.session_key,
          uid: "",
        },
        method: "post",})
        .then(res => {
          console.log(res);
        })
    }
  },
  submit: function (e) {
    var that = this
    var phone = that.data.phone;
    if (phone == '') {
      wx.showToast({
        title: '请输入手机号',
        image: '/images/system/error.png',
        duration: 2000
      })
      return;
    }else if (phone.trim().length != 11 || !/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      wx.showToast({
        title: '格式不正确',
        image: '/images/system/error.png',
        duration: 2000
      })
      return;
    }
    else {
      var that = this
      util.requestUrl({
        url: 'api/user/businessRegister',
        params: {
          id: app.globalData.userInfo.id,
          phone: phone
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