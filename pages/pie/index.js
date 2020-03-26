import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    ec: {
      onInit: function (canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(getData());
        return chart;
      }
    }
  },
  onLoad: function (options) {
    this.echartsComponnet = this.selectComponent('#chart');
    this.getData(); //获取数据
  }
});
function getData(){
  util.requestUrl({
    url: '/api/component/getUserComponent',
    method: "POST"
  })
  .then(res => {
    console.info(res)
  })
  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['40%', '60%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }]
    }]
  };
  return option;
}
