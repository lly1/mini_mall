var app = getApp();
var uploadFileUrl = app.basePath + "upPic";
var util = require('../../utils/util.js')
Page({
  data: {
    id:'',
    logo:'',
    order: '',
    imgUrl: '',
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/none.png',
    selectedSrc: '../../images/show.png',
    halfSrc: '../../images/half.png',
    key: 0,//评分
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      order: JSON.parse(options.order)
    })
  },
  saveComment: function (e) {
    var that = this;
    util.requestUrl({
      url: '/api/order/rateOrder',
      params: {
        userId: app.globalData.userInfo.id,
        shopId: that.data.order.shopId,
        orderId: that.data.order.id,
        content: e.detail.value.content,
        star: that.data.key,
        imgUrl: that.data.imgUrl
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      if(res.success){
        wx.showToast({
          title: res.data,
          duration: 1000
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }
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
              imgUrl: rtnPath.replace(/\"/g,'')
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
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    console.log("得" + key + "分")
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
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