var app = getApp();
var uploadFileUrl = app.basePath + "upPic";
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productComponent:[{}],
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
    statusIndex: 0,
    components:[],
    componentsArr:[[],[]],
    componentsIndex: [0,0]
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      categoryList: app.globalData.userInfo.shop.tShopCategory,
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
    that.getProductComponent(options.id);
    that.getComponent();
  },
  getProductComponent(productId){
    var that = this;
    util.requestUrl({
      url: '/api/component/getProductComponent',
      params: {productId : productId},
      method: "POST"  
    })
    .then(res => {
      var data = res.data;
      that.setData({
        productComponent : data
      })
    })
  },
  getComponent(){
    var that = this;
    util.requestUrl({
      url: '/api/component/getComponent',
      method: "POST"
    })
    .then(res => {
      var data = res.data;
      console.info(data)
      for (var i = 0; i < data.length; i++) {
        that.data.componentsArr[0].push(data[i]);
        for (var j = 0; j < data[i].componentList.length; j++) {
          that.data.componentsArr[1].push(data[i].componentList[j])
        }
      }
      that.setData({
        components: data,
        componentsArr: that.data.componentsArr
      })
    })
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
  components: function (e) {
    var index = e.detail.value;
    console.info(index)
    let vid = e.currentTarget.dataset.index
    var component = this.data.componentsArr[1][index[1]];
    var productComponent = this.data.productComponent;
    productComponent[vid] = {...productComponent[vid],componentId:component.id,componentName:component.name};
    this.setData({
      componentsIndex: index,
      productComponent
    })
  },
  total: function (e) {
    let vid = e.currentTarget.dataset.index
    var productComponent = this.data.productComponent;
    productComponent[vid] = {...productComponent[vid],productId:this.data.id,total:e.detail.value};
    this.setData({
      productComponent
    })
  },
  columnChange: function(e){
    var that = this;
    that.data.componentsIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        that.data.components.forEach(item => {
          if(item.id == that.data.componentsArr[0][e.detail.value].id){
            that.data.componentsArr[1] = item.componentList;
          }
        });
        break;
    }
    that.setData({
      componentsArr: that.data.componentsArr,
      componentsIndex: that.data.componentsIndex
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
        shopId: app.globalData.userInfo.shop.id,
        id: that.data.id,
        categoryId : that.data.categoryList[that.data.categoryIndex].id,
        productName : fdata.name,
        productPrice : fdata.price,
        productStock : fdata.stock,
        productInfo : fdata.info,
        productIcon : that.data.icon,
        productStatus : that.data.status[that.data.statusIndex].id,
        componentList : that.data.productComponent
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
  addList: function(){
    var productComponent = this.data.productComponent;
    productComponent.push({});//实质是添加lists数组内容，使for循环多一次
    this.setData({
      productComponent: productComponent,
    })  
  },
  delList: function () {
    var productComponent = this.data.productComponent;
    productComponent.pop();      //实质是删除lists数组内容，使for循环少一次
    this.setData({
      productComponent: productComponent,
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