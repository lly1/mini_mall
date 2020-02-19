var app = getApp();
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function wxLogin(that) {
  	var js_code = wx.getStorageSync("js_code");
    wx.request({
      url: app.basePath + "wxAuth/login",
      data: {
        js_code: js_code
      },
      success: function (res) {
        console.info(res);
        var token = res.data.data.accessToken;
        app.globalData.token = token;
        app.globalData.session_key = res.data.data.session_key;
   			wx.getUserInfo({
	        success: function (res)  {              
	          // 保存用户信息到服务端
	          wx.request({
              url: app.basePath + "/api/user/updateWxUserInfo",
	            data: res.userInfo,
	            method: "POST",
	            header: {
                'cookie': 'JSESSIONID='+ token,
	              'content-type': 'application/json',
	            },
	            success: function (res) {
                app.globalData.userInfo = res.data.data;
                if(res.data.data.newOrder){
                  that.setData({
                    userInfo: res.data.data,
                    newOrder: res.data.data.newOrder
                  });
                }else{
                  that.setData({
                    userInfo: res.data.data,
                  });
                }
                wx.hideLoading();
                console.log('微信登录成功');
	            },
	            fail: function (error) {
	              console.log(error);
	            }
	          })
	        }
	      });
      },
      complete: function (res) {
        
      }
    });
}
/* 公共request 方法 */
const requestUrl=({
  url,
  params,
  method,
})=>{
 wx.showLoading({
   title: '加载中',
 });
 let server = app.basePath;
 let token = app.globalData.token;
 that=this;
 console.info(params);
 if (token != "" && token !=null){
   var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + token }
 }else{
   var header = { 'content-type': 'application/x-www-form-urlencoded'}
 }
 return new Promise(function (resolve, reject) {
   wx.request({
     url: server + url,
     method: method,
     data: params,
     header: header,
     success: (res) => {
       wx.hideLoading();
       if (res.data.succress === 'error' || res['statusCode']!==200) {
         wx.showToast({
           title: res.data.msg || '请求出错',
           icon: 'none',
           duration: 2000,
           mask: true
         })
       }
       resolve(res.data)
     },
     fail: function (res) {
       wx.hideLoading();
       wx.showToast({
         title: res.data.msg || '',
         icon: 'none',
         duration: 2000,
         mask: true
       })
       reject(res.data)
     },
     complete: function () {
       wx.hideLoading()
     }
   })
 })
   .catch((res) => { })
}
module.exports = {
  formatTime: formatTime,
  wxLogin: wxLogin,
  requestUrl: requestUrl
}
