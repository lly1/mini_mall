var app = getApp();
var uploadFileUrl = app.basePath + "upPic";
var util = require('../../utils/util.js')
Page({
  data: {
    id:null,
    logo:null,
    shopLogo:null,
    shopName:null,
    openTime:null,
    shopInfo:null,
    longitude:null,
    latitude:null
  },
  onLoad: function (options) {
    var that = this;
    util.requestUrl({
      url: '/api/shop/getShopInfo',
      params: {
        userId: app.globalData.userInfo.id,
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      that.setData({
        id: data.id,
        logo: app.basePath + data.shopLogo,//显示图片用
        shopLogo: data.shopLogo,//存储数据用
        shopName: data.shopName,
        openTime: data.openTime,
        shopInfo: data.shopInfo,
        longitude: data.longitude,
        latitude: data.latitude
      })
    })
  },
  saveshop: function (e) {
    if(!this.data.longitude){
      wx.showToast({
        title: '请选择地址',
        image: '/images/system/error.png',
        duration: 1000
      });
      return;
    }
    var that = this;
    console.log(e.detail.value);
    var fdata = e.detail.value;
    wx.request({
      url: app.basePath + '/api/shop/saveShopInfo',
      method: 'post',
      data: {
        userId: app.globalData.userInfo.id,
        id: that.data.id,
        shopLogo : that.data.shopLogo,
        shopName : fdata.shopName,
        openTime : fdata.openTime,
        shopInfo : fdata.shopInfo,
        longitude : that.data.longitude,
        latitude : that.data.latitude
      },
      header: {
        'cookie': 'JSESSIONID='+ app.globalData.token
      },
      success: function (res) {
        wx.showToast({
          title: res.data.message,
        })
        if (res.data.code == '0000') {
          wx.redirectTo({
            url: '/pages/shop/shop',
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 30000
        });
      },
    })
  },
  // 上传图片
  logo: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths)
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: uploadFileUrl,
          filePath: imageSrc,
          method: 'post',
          name: 'file',
          header: {
            'cookie': 'JSESSIONID='+ app.globalData.token
          },
          success: function (res) {
            console.log('uploadImage success, res is:', res)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            var rtnPath = res.data;
            self.setData({
              logo: imageSrc,
              shopLogo: rtnPath.replace(/\"/g,'')
            })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })

      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  },
  selectLocation: function(){
    wx.navigateTo({
      url: '/pages/map/map',
    });
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