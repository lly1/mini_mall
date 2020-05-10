// pages/home/home.js
var util = require('../../utils/util.js')
// 引入SDK核心类
var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.basePath,
    shopList: [],
    categoryList:[],
    selected: 0,
    location: '',
    longitude: '',
    latitude: '',
    selectedNumb: 0,
    pageNo: 1,
    pageSize: 10,
    more: 1 //是否还有未加载数据
  },
  defaultSelect: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index,
      pageNo: 1
    });
    this.getShopList();
  },
  selectBySale: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index,
      pageNo: 1
    });
    this.getShopList();
  },
  selectByDistance: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index,
      pageNo: 1
    });
    this.getShopList();
  },
  selectByStar: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index,
      pageNo: 1
    });
    this.getShopList();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'LZBBZ-ARJEX-U7J4D-72K42-3SNKH-E5BLU'
    });
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (res)=>{
        console.info(res);
        const la = res.latitude;
        const lo = res.longitude;
        wx.setStorage({key: 'longitude',data: lo});
        wx.setStorage({key: 'latitude',data: la});
        that.setData({ 
          longitude: lo,
          latitude: la
        });
        qqmapsdk.reverseGeocoder({
          location:{
            latitude: la,
            longitude: lo
          },
          success: function(res){
            console.log(la,lo);
            var res = res.result;
            that.setData({ 
              location: res.address,
            });
          },
          fail: function(error) {
            console.error(error);
            wx.hideLoading({});
            wx.showToast({
              title: '定位失败',
              icon: 'none',
              duration: 1500
            })
          }
        });
      },
      fail: (res)=>{
        console.error(res);
        wx.showToast({
          title: 授权失败,
        })
      },
      complete: ()=>{}
    });
  },
  getShopList: function(){
    var that = this;
    util.requestUrl({
      url: '/sale/shop/getShopList'+that.data.selected,
      params: {
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      if(data){
        that.setData({
          shopList: data.records
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (res)=>{
        console.info(res);
        that.getShopList();
      }
    })
  },
  lower: function (e){
    var that = this;
    if(that.data.more){
      that.setData({
        pageNo: that.data.pageNo+1
      })
      util.requestUrl({
        url: '/sale/shop/getShopList'+that.data.selected,
        params: {
          pageNo: that.data.pageNo,
          pageSize: that.data.pageSize,
          longitude: that.data.longitude,
          latitude: that.data.latitude
        },
        method: "POST"
      })
      .then(res => {
        var data = res.data;
        if(data.records.length > 0){
          data.records.forEach(item => {
            that.data.shopList.push(item)
          });
          that.setData({
            shopList: that.data.shopList
          })
        }else{
          that.setData({
            pageNo: that.data.pageNo-1,
            more: 0
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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