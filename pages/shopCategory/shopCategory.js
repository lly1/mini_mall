var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hide: true,
    categoryId: '',
    categoryName: '',
    categoryList: [],
    startX: 0, //开始坐标
    startY: 0
  },
  addCategory: function() {
    this.setData({
      hide: false,
      categoryId: '',
      categoryName: ''
    })
  },

  editCategory: function(e) {
    console.info(e) 
    this.setData({
      hide: false,
      categoryId: e.currentTarget.dataset.id,
      categoryName: e.currentTarget.dataset.name
    })
  },
  //删除事件
  del: function (e) {
    var that = this;
    util.requestUrl({
      url: '/api/shop/delShopCategory',
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
      that.setData({
        categoryList: res.data
      })
      app.globalData.userInfo.shop.tShopCategory = res.data
    })
},
  cancel() {
    this.setData({
      hide: true
    })
  },
  saveCategory: function(){
    var that = this;
    util.requestUrl({
      url: '/api/shop/saveShopCategory',
      params: {
        id: that.data.categoryId,
        shopId: app.globalData.userInfo.shop.id,
        categoryName: that.data.categoryName
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      wx.showToast({
        title: res.message,
      });
      that.setData({
        hide: true,
        categoryList: res.data
      })
      app.globalData.userInfo.shop.tShopCategory = res.data
    })
  },
  inputName: function(e){
    console.info(e);
    this.setData({
      categoryName: e.detail.value
    })
  },
  onLoad: function() {
    this.setData({
      categoryList: app.globalData.userInfo.shop.tShopCategory
    })
  },
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.categoryList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      categoryList: this.data.categoryList
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
    that.data.categoryList.forEach(function (v, i) {
    v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
        v.isTouchMove = false
        else //左滑
        v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      categoryList: that.data.categoryList
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
 
  onShow: function() {
    var that = this;
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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