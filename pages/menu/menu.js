var app = getApp();
var util = require('../../utils/util.js')
// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo:1,
    pageSize: 10,
    more:1,
    shopId: '',
    shop: null,
    basePath: app.basePath,
    cartStatus: false,
    swiperTitle: [{
      text: "下单",
      id: 1
    },{
      text: "评价",
      id: 2
    }],
    categoryList:[],//菜单
    cartList:[],//购物车
    commentList:[],//评价
    currentPage: 0,
    selected: 0,//选择的类目
    cost:0,
    buyTotal: 0
  },
  addToCart: function (e) {
    var that = this;
    var productId = e.currentTarget.dataset.productid
    var info = that.data.categoryList;
    var buyNum = info[that.data.selected].shopProducts[e.currentTarget.dataset.index].cart;
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
      info[that.data.selected].shopProducts[e.currentTarget.dataset.index].cart = res.data
      that.setData({
        categoryList: info
      })
      that.getCart();
    })
  },
  removeFromCart: function (e) {
    var that = this;
    var info = that.data.categoryList;
    var buyNum = info[that.data.selected].shopProducts[e.currentTarget.dataset.index].cart;
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
        info[that.data.selected].shopProducts[e.currentTarget.dataset.index].cart = null
      }else{
        info[that.data.selected].shopProducts[e.currentTarget.dataset.index].cart = res.data
      }
      that.setData({
        categoryList: info
      })
      that.getCart();
    })
  },
  cartAdd(e){
    var that = this;
    var cart = e.currentTarget.dataset.cart
    cart.buyNum =  cart.buyNum +1;
    util.requestUrl({
      url: '/api/cart/saveCart',
      params: {
        id: cart.id,
        userId: app.globalData.userInfo.id,
        shopId: that.data.shopId,
        productId: cart.product.id,
        buyNum: cart.buyNum
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.updateCate(res.data);
      that.getCart();
      that.setData({
        categoryList: that.data.categoryList
      })
    })
  },
  cartRemove(e){
    var that = this;
    var cart = e.currentTarget.dataset.cart
    cart.buyNum =  cart.buyNum -1;
    util.requestUrl({
      url: '/api/cart/delCart',
      params: {
        id: cart.id,
        buyNum: cart.buyNum
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      if(res.data){
        that.updateCate(res.data);
      }else{
        that.updateCate(cart);
      }
      that.getCart();
      that.setData({
        categoryList: that.data.categoryList
      })
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
  updateCate(cart){
    this.data.categoryList.forEach(function(v,i){
      v.shopProducts.forEach(function(item,index){
        if(item.cart && item.cart.id == cart.id){
          if(cart.buyNum!=0){
            item.cart = cart
          }else{
            item.cart = null
          }
        }
      })
    })
  },
  turnPage: function (e) {
    this.setData({
      currentPage: e.currentTarget.dataset.index,
      pageNo:1,
      more:1
    })
  },
  turnTitle: function (e) {
    if(e.detail.source=="touch"){
      this.setData({
        currentPage: e.detail.current,
        pageNo:1,
        more:1
      })
    }
  },
  turnCategory: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
  },
  getCart: function(){
    var that = this;
    util.requestUrl({
      url: '/api/cart/getCart',
      params: {
        shopId: that.data.shopId,
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
  // 显示隐藏购物车详情
  changeCartStatus() {
    this.setData({
      cartStatus: !this.data.cartStatus
    })
  },
  goDetail: function (e){
    wx.navigateTo({
      url:'/pages/productDetail/productDetail?product='+JSON.stringify(e.currentTarget.dataset.product)
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
  getComment(){
    var that = this;
    util.requestUrl({
      url: '/api/shop/getShopComment',
      params: {
        shopId: that.data.shopId,
        pageNo: that.data.pageNo,
        pageSize: that.data.pageSize
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.setData({
        commentList: res.data.records
      })
    })
  },
  lower: function (e){
    var that = this;
    if(that.data.more){
      that.setData({
        pageNo: that.data.pageNo+1
      })
      util.requestUrl({
        url: '/api/shop/getShopComment',
        params: {
          shopId: that.data.shopId,
          pageNo: that.data.pageNo,
          pageSize: that.data.pageSize
        },
        method: "POST"
      })
      .then(res => {
        var data = res.data;
        if(data.records.length > 0){
          data.records.forEach(item => {
            that.data.commentList.push(item)
          });
          that.setData({
            commentList: that.data.commentList
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.info(options)
    that.setData({
      shopId: options.shopId
    })
    util.requestUrl({
      url: '/api/shop/getShopInfoById',
      params: {
        id: options.shopId,
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.setData({
        shop: res.data,
      })
      that.getComment();
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
    var that = this;
    util.requestUrl({
      url: '/api/shop/getShopCategory',
      params: {
        shopId: that.data.shopId,
        isSale: '1',
        userId: app.globalData.userInfo.id
      },
      method: "POST"
    })
    .then(res => {
      console.info(res)
      that.setData({
        categoryList: res.data,
        
      })
      that.getCart();
    })
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