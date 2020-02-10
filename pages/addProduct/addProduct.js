var app = getApp();
var uploadFileUrl = app.basePath + "upPic";
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: [{
      name: "下架",
      id: 0
    }, {
      name: "上架",
      id: 1
    }],
    categoryList: [],
    id: '',
    name: '',
    price: '',
    info: '',
    stock: '',
    icon: '',
    categoryIndex: 0,
    statusIndex: 0
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    util.requestUrl({
      url: '/api/shop/getShopCategory',
      params: {
        shopId: app.globalData.shopId,
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      that.setData({
        categoryList: data
      })
      //编辑进来的    
      if(options.id){
        util.requestUrl({
          url: '/api/shop/getShopProduct',
          params: {
            productId: options.id,
          },
          method: "POST"
        })
        .then(res => {
          var data = res.data;
          var categoryInd = -1;
          for (var i = 0; i < that.data.categoryList.length; i++) {
            if (that.data.categoryList[i].id === data.categoryId) {
              categoryInd = i
              break;
            } else {
              categoryInd = 0;
            }
          }
          that.setData({
            id: data.id,
            name: data.productName,
            price: data.productPrice,
            info: data.productInfo,
            stock: data.productStock,
            iconShow: app.basePath + data.productIcon,
            icon: data.productIcon,
            statusIndex: data.productStatus,
            categoryIndex: categoryInd
          })
        })
      }
    });
  },
  category: function (e){
    this.setData({
      categoryIndex: e.detail.value
    })

  },
  status: function (e) {
    this.setData({
      statusIndex: e.detail.value
    })
  },
  saveProduct: function (e) {
    var that = this;
    console.log(e.detail.value);
    var fdata = e.detail.value;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.basePath + '/api/shop/saveShopProduct',
      method: 'post',
      data: {
        shopId: app.globalData.shopId,
        id: that.data.id,
        categoryId : that.data.categoryList[that.data.categoryIndex].id,
        productName : fdata.name,
        productPrice : fdata.price,
        productStock : fdata.stock,
        productInfo : fdata.info,
        productIcon : that.data.icon,
        productStatus : that.data.status[that.data.statusIndex].id
      },
      header: {
        'cookie': 'JSESSIONID='+ app.globalData.token
      },
      success: function (res) {
        wx.hideLoading();
        console.info(res)
        wx.showToast({
          title: res.data.message,
          duration: 1000
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
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
  icon: function () {
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
              icon: rtnPath.replace(/\"/g,''),
              iconShow: imageSrc
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