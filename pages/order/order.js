var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperTitle: [{
      text: "全部订单",
      id: 0
    },{
      text: "未支付",
      id: 1
    },{
      text: "未评价",
      id: 2
    }],
    currentPage: 0,
    basePath: app.basePath,
    orderList: [],
    rtnCode: null,
    hide: true,
    pageNo: 1,
    pageSize: 10,
    more: 1, //是否还有未加载数据
    startX: 0, //开始坐标
    startY: 0
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
  confirm: function (e){
    var that = this;
    util.requestUrl({
      url: '/api/order/confirm',
      params: {
        orderId: e.currentTarget.dataset.orderid,
      },
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      wx.showToast({
        title: data,
        duration: 1000
      })
      that.getOrder();
    })
  },
  goToPay: function (e){
    wx.navigateTo({
      url: '/pages/pay/pay?orderId='+e.currentTarget.dataset.orderid
    })
  },
  goDetail: function (e){
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order='+JSON.stringify(e.currentTarget.dataset.order)
    })
  },
  buyAgain: function (e){
    wx.request({
      url: app.basePath + "/api/order/buyAgain",
      data: JSON.stringify(e.currentTarget.dataset.detail),
      method: "POST",
      header: {
        'cookie': 'JSESSIONID='+ app.globalData.token
      },
      success: function (res) {
        if(res.data.data == 'success'){
          wx.navigateTo({
            url: '/pages/menu/menu?shopId='+e.currentTarget.dataset.shopid,
          });
        }
      },
    })
  },
  // 禁止左右滑动，影响删除
  catchTouchMove:function(res){
    return false
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
      if(!res.success){
        wx.showModal({
          title: '提示',
          content: res.data,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              
            }
          },
        });
      }
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
        url: '/api/order/getUserOrder'+that.data.currentPage,
        params: {
          userId: app.globalData.userInfo.id,
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
      url: '/api/order/getUserOrder'+that.data.currentPage,
      params: {
        userId: app.globalData.userInfo.id,
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
  touchstart: function(e) {
    var that = this;
    //开始触摸时 重置所有删除
    that.data.orderList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      orderList: that.data.orderList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.orderList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) {
        return;
      }
      if (i == index) {
        if (touchMoveX > startX){
          //右滑
          v.isTouchMove = false
        }else{
          //左滑
          v.isTouchMove = true
        }
      }
    })
    //更新数据
    that.setData({
      orderList: that.data.orderList
    })
  },
  /**
    * 计算滑动角度
    * @param {Object} start 起点坐标
    * @param {Object} end 终点坐标
    */
  angle: function (start, end) {
    var _X = end.X - start.X,
    _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
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