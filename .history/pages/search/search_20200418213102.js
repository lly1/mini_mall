import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const util = require('../../utils/util.js')
var chart = null
Page({
  data: {
  },
  onLoad: function (options) {
    
  },
  // 搜索
  goSearch: function(e) {
    var that = this;
    var formData = e.detail.value;
    if (formData) {
 
      wx.request({
        url: 'https://xxxxx/homepage/search',
        data: {
          title: formData
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          that.setData({
            search: res.data,
          })
          if (res.data.msg=='无相关视频'){
            wx.showToast({
              title: '无相关视频',
              icon: 'none',
              duration: 1500
            })
          }else{
            let str = JSON.stringify(res.data.result.data);
            wx.navigateTo({
              url: '../searchShow/searchShow?data=' + str
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 1500
      })
    }
  }
});

