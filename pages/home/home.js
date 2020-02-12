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
    selected: 2,
    animationData: "",
    location: '',
    longitude: '',
    latitude: '',
    characteristicSelected: [false,false,false,false,false,false,false],
    discountSelected:null,
    selectedNumb: 0,
    pageNo: 1,
    pageSize: 10
  },
  finish: function () {
    var that = this;
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/filter",
    //   method: "GET",
    //   success: function (res) {
    //     that.setData({
    //       restaurant: res.data.data.restaurant,
    //     })
    //   }
    // });
    util.requestUrl({
      url: '/api/shop/getShopList',
      params: {
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      if(data){
        that.setData({
          shopList: data
        })
      }
    })
  },
  sortSelected: function (e) {
    var that = this;
    wx.request({
    url:"https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/overAll",
      method: "GET",
      success: function (res) {
        that.setData({
          restaurant: res.data.data.restaurant,
          sortSelected: that.data.sortList[e.currentTarget.dataset.index].sort
        })
      }
    });
  },
  clearSelectedNumb: function () {
    this.setData({
      characteristicSelected: [false],
      discountSelected: null,
      selectedNumb: 0
    })
  },
  characteristicSelected: function (e) {
    var info = this.data.characteristicSelected;
    info[e.currentTarget.dataset.index] = !info[e.currentTarget.dataset.index];
    this.setData({
      characteristicSelected: info,
      selectedNumb: this.data.selectedNumb + (info[e.currentTarget.dataset.index]?1:-1)
    })
    console.log(e.currentTarget.dataset.index);
  },
  discountSelected: function (e) {
    if (this.data.discountSelected != e.currentTarget.dataset.index){
      this.setData({
        discountSelected: e.currentTarget.dataset.index,
        selectedNumb: this.data.selectedNumb+(this.data.discountSelected==null?1:0)
      })
    }else{
      this.setData({
        discountSelected: null,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
  },
  onTapTag: function (e) {
    console.info(e);
    this.setData({
      selected: e.currentTarget.dataset.index
    });
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
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (res)=>{
        console.info(res);
        const la = res.latitude;
        const lo = res.longitude;
        that.setData({ 
          longitude: lo,
          latitude: la
        });
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
      }
    })
    
  },
  lower: function (e){
    console.info(e)
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