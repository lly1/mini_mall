const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    basePath: app.basePath,
    shopList:[],
    longitude: null,
    latitude: null,
    searchData: null,
    hide: true,
    show: false
  },
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'longitude',
      success (res) {
        that.setData({
          longitude: res.data
        })
      } 
    });
    wx.getStorage({
      key: 'latitude',
      success (res) {
        that.setData({
          latitude: res.data
        })
      } 
    })
  },
  getInput(e){
    this.setData({
      searchData: e.detail.value,
    }) 
  },
  // 搜索
  goSearch: function(e) {
    var that = this;
    var searchData = that.data.searchData
    if (searchData) {
      util.requestUrl({
        url: '/sale/shop/getShopListByName',
        params: {
          shopName: searchData,
          longitude: that.data.longitude,
          latitude: that.data.latitude
        },
        method: "POST"
      })
      .then(res => {
        var data = res.data;
        if(data.length > 0){
          that.setData({
            shopList: data,
            hide: false,
            show: false
          })
        }else{
          that.setData({
            shopList: null,
            show: true
          })
        }
      })
    } else {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1000
      })
    }
  },
  jump: function(e){
    console.info(e)
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/menu/menu?shopId='+e.currentTarget.dataset.shopid,
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            wx.switchTab({
              url: '/pages/my/my',
            });
          }
        },
      });
    }  
  },
});

