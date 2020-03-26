import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const util = require('../../utils/util.js')
var chart = null
Page({
  data: {
    ec: {
      onInit: function (canvas, width, height, dpr) {
        chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        return chart;
      }
    },
    button: [{
      type: 0,
      name: '当日'
    },
    {
      type: 1,
      name: '近一周'
    },
    {
      type: 2,
      name: '近一月'
    }],
    show: false,
    type: 0
  },
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#mychart');
    this.getData();
  },
  getData(){
    var that = this;
    util.requestUrl({
      url: '/api/component/getUserComponent',
      params: {type: that.data.type},
      method: "POST"
    })
    .then(res => {
      if(res.data < 1){
        that.setData({
          show: true,
        })
      }else{
        that.setData({
          show: false,
        })
        chart.clear();
        setTimeout(function(){
          chart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 10,
              data: ['蛋白质', '脂肪', '碳水化合物', '卡路里', '无机盐','钙','磷','铁']
            },
            backgroundColor: "#ffffff",
            color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
            series: [{
              label: {
                normal: {
                  fontSize: 14
                }
              },
              type: 'pie',
              radius: '45%',
              data: res.data
            }]
          });
        },200);
        
      }
    })
  },
  changeGroup: function(event){
    var that =this;
    var type = event.currentTarget.dataset.id;
    this.setData({
      type: type
    });
    
    this.getData();
  },
  //初始化图表
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      return chart;
    });
  }
});

