var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperTitle: [{
      text: "待处理",
      id: 0
    },{
      text: "已完成订单",
      id: 1
    }],
    currentPage: 0,
    basePath: app.basePath,
    orderList: [],
    pageNo: 1,
    pageSize: 10,
    more: 1, //是否还有未加载数据
    rtnCode: null,
    hide: true
  },
  showCode: function (e){
    this.setData ({
      hide: false,
      rtnCode: e.currentTarget.dataset.rtncode
    })
  },
  cancel() {
    this.setData({
      hide: true
    })
  },
  accept: function (e){
    var that = this;
    util.requestUrl({
      url: '/api/order/acceptOrder',
      params: {
        id: e.currentTarget.dataset.orderid,
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      wx.showToast({
        title: res.data,
      });
      that.getOrder();
    })
  },
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index,
      orderList: []
    })
    this.getOrder();
  },
  turnTitle: function (e) {
    if(e.detail.source=="touch"){
      this.setData({
        currentPage: e.detail.current,
        orderList: []
      })
      this.getOrder();
    }
  },
  //删除事件
  del: function (e) {
    var that = this;
    util.requestUrl({
      url: '/api/order/delOrder',
      params: {
        id: e.currentTarget.dataset.id,
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      wx.showToast({
        title: res.message,
      });
      that.getOrder();
    })
  },
  lower: function (e){
    var that = this;
    if(that.data.more){
      that.setData({
        pageNo: that.data.pageNo+1
      })
      util.requestUrl({
        url: '/api/order/getShopOrder'+that.data.currentPage,
        params: {
          shopId: app.globalData.userInfo.shop.id,
          pageNo: that.data.pageNo,
          pageSize: that.data.pageSize,
        },
        method: "POST"
      })
      .then(res => {
        var data = res.data;
        if(data.records.length > 0){
          data.records.forEach(item => {
            that.data.orderList.push(item)
          });
          that.setData({
            orderList: that.data.orderList
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
  getOrder:function(){
    var that = this;
    util.requestUrl({
      url: '/api/order/getShopOrder'+that.data.currentPage,
      params: {
        shopId: app.globalData.userInfo.shop.id,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize,
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      if(data){
        that.setData({
          orderList: data.records
        })
      }
    })
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
    if(!app.globalData.userInfo){
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
    }else{
      that.getOrder();
    } 
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