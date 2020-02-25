var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basePath: app.basePath,
    shopId: '',
    shop: '',
    product:'',
    cartList:[],
    cartStatus: false,
    cost: 0,
    buyTotal: 0,
    isStar: 0,
    longitude: '',
    latitude: ''
  },
  addToCart: function (e) {
    var that = this;
    var productId = that.data.product.id;
    var buyNum = that.data.product.cart;
    var cartId = '';
    if(buyNum){
      cartId = buyNum.id;
      buyNum = buyNum.buyNum+1;
    }else{
      buyNum = 1;
    }
    util.requestUrl({
      url: '/api/cart/saveCart',
      params: {
        id: cartId,
        userId: app.globalData.userInfo.id,
        shopId: that.data.shopId,
        productId: productId,
        buyNum: buyNum
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.data.product.cart = res.data
      that.setData({
        product: that.data.product
      })
      that.getCart();
    })
  },
  removeFromCart: function (e) {
    var that = this;
    var buyNum = that.data.product.cart;
    var cartId = '';
    if(buyNum){
      cartId = buyNum.id;
      buyNum = buyNum.buyNum-1;
    }else{
      buyNum = 1;
    }
    util.requestUrl({
      url: '/api/cart/delCart',
      params: {
        id: cartId,
        buyNum: buyNum
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      if(buyNum == 0){
        that.data.product.cart = null
      }else{
        that.data.product.cart = res.data
      }
      that.setData({
        product: that.data.product
      })
      that.getCart();
    })
  },
  clearCart: function(){
    var that = this;
    util.requestUrl({
      url: '/api/cart/delAllCart',
      params: {
        userId: app.globalData.userInfo.id,
        shopId: that.data.shopId,
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      if(res.data == "success"){
        that.data.categoryList.forEach(function (v, i) {
          v.shopProducts.forEach(function (item,index){
            item.cart = null
          })
        })
        that.setData({
          categoryList: that.data.categoryList,
          cartList: null
        })
      }else{
        wx.showToast({
          title: '清空失败',
          icon: '/images/system/error.png',
          duration: 2000
        })
      }
      that.getCart();
    })
  },
  getCart: function(){
    var that = this;
    util.requestUrl({
      url: '/api/cart/getCart',
      params: {
        shopId: that.data.shop.id,
        userId: app.globalData.userInfo.id
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      if(res.data){
        var cost = 0;
        var buyTotal = 0;
        res.data.forEach(function (v, i) {
            cost += v.product.productPrice * v.buyNum
            buyTotal += v.buyNum
        })
        that.setData({
          cartList: res.data,
          cost: cost,
          buyTotal: buyTotal
        }) 
      }
    })
  },
  star: function(){
    var that = this;
    util.requestUrl({
      url: '/api/shop/productStar',
      params: {
        productId: that.data.product.id
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.data.product.starTotal = res.data.starTotal
      that.setData({
        product: that.data.product,
        isStar: 1
      })
    })
  },
  starDel: function(){
    var that = this;
    util.requestUrl({
      url: '/api/shop/productStarDel',
      params: {
        productId: that.data.product.id
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.data.product.starTotal = res.data.starTotal
      that.setData({
        product: that.data.product,
        isStar: 0
      })
    })
  },
// 显示隐藏购物车详情
changeCartStatus() {
  this.setData({
    cartStatus: !this.data.cartStatus
  })
},
 // 确认订单
 goSureOrder() {
  var that = this;
  if (that.data.cartList.length < 1) {
    wx.showToast({
      title: '请选择商品',
      icon: '/images/system/error.png',
      duration: 2000
    })
    return
  }
  util.requestUrl({
    url: '/api/order/createOrder',
    params: {
      shopId: that.data.shopId,
      userId: app.globalData.userInfo.id,
      payTotal: that.data.cost
    },
    method: "POST"
  })
  .then(res => {
    console.info(res)
    if(res.success){
      wx.navigateTo({
        url: '/pages/pay/pay?orderId='+res.data.id
      })
    }else{
      wx.showToast({
        title: '创建订单失败',
        icon: '/images/system/error.png',
        duration: 2000
      })
    }     
  })
},
goShop(){
  wx.navigateBack({
    delta: 1
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var product = JSON.parse(options.product);
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (res)=>{
        console.info(res);
        that.setData({ 
          longitude: res.longitude,
          latitude: res.latitude,
          product: product,
          shopId: product.shopId
        });
        util.requestUrl({
          url: '/api/shop/getShopInfoById',
          params: {
            id: product.shopId,
            longitude: res.longitude,
            latitude: res.latitude
          },
          method: "POST"
        })
        .then(res => {
          console.info(res)
          that.setData({
            shop: res.data
          }) 
          that.getCart();
        })
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