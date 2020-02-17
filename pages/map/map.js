var app = getApp();
var util = require('../../utils/util.js')
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nearList:[],
    latitude:null,
    longitude:null,
    address: '',
    selectedId: 0,
    currentRegion: {
      province: '选择城市',
      city: '选择城市',
      district: '选择城市',
    },
    suggestion: [],
    centerData: null,
    defaultKeyword: '餐厅',
    keyword:null
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.mapCtx = wx.createMapContext('myMap');
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
        qqmapsdk.reverseGeocoder({
          location:{
            latitude: la,
            longitude: lo
          },
          success: function(res){
            console.log(la,lo);
            var res = res.result;
            that.setData({ 
              latitude: la,
              longitude: lo,
              currentRegion: res.address_component,
              keyword: that.data.defaultKeyword,
              address: res.address
            });
            //调用接口
            that.nearby_search();
          },
          fail: function(error) {
            console.error(error);
            wx.hideLoading({});
            wx.showToast({
              title: '定位失败',
              icon: 'none',
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
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
  
  //监听拖动地图，拖动结束根据中心点更新页面
  mapChange: function (e) {
    let that = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')){
      that.mapCtx.getCenterLocation({
        success: function (res) {
          console.log(res)
          that.setData({
            nearList:[],
            latitude: res.latitude,
            longitude: res.longitude,
          })
          that.getAddress(res.latitude,res.longitude);
          that.nearby_search();
        }
      })
    } 
  },
  getAddress: function(la,lo){
    var that = this;
    qqmapsdk.reverseGeocoder({
      location:{
        latitude: la,
        longitude: lo
      },
      success: function(res){
        console.log(la,lo);
        var res = res.result;
        that.setData({ 
          address: res.address
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
  //点击选择地图下方列表某项
  chooseCenter: function (e) {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.data.nearList.length; i++) {
      if (i == id) {
        this.setData({
          selectedId: id,
          centerData: this.data.nearList[i],
          latitude: this.data.nearList[i].latitude,
          longitude: this.data.nearList[i].longitude,
          address: this.data.nearList[i].addr,
        });
        this.addMarker(this.data.nearList[id]);
        return;
        //console.log(this.data.centerData)
      }
    }
  },
  //地图标记点
  addMarker: function (data) {
    var that = this;
    //console.log(data)
    //console.log(data.title)
    var mks = [];
    mks.push({ // 获取返回结果，放到mks数组中
      title: data.title,
      id: data.id, 
      addr: data.addr,
      province: data.province,
      city: data.city,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      iconPath: '/images/system/placeholder.png', //图标路径
      width: 25,
      height: 25
    })
    this.setData({ //设置markers属性，将搜索结果显示在地图中
      markers: mks,
      currentRegion: {
        province: data.province,
        city: data.city,
        district: data.district 
      },
    })
    wx.hideLoading();
  },
  // 根据关键词搜索附近位置
  nearby_search: function () {
    var self = this;
    wx.showLoading({
      title: '加载中'
    });
    // 调用接口
    qqmapsdk.search({
      keyword: self.data.keyword,  //搜索关键词
      //boundary: 'nearby(' + self.data.latitude + ', ' + self.data.longitude + ', 1000, 16)',
      location: self.data.latitude + ',' + self.data.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setData({
          selectedId: 0,
          centerData: sug[0],
          nearList: sug, 
          suggestion: sug
        })
        self.addMarker(sug[0]);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },//确认选择地址
  selectedOk: function () {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2]; 
    prevPage.setData({
      location: this.data.address,
      longitude: this.data.longitude,
      latitude: this.data.latitude
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //重新定位
  reload: function () {
    this.onLoad();
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