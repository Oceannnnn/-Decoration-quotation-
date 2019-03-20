// pages/toLogin/toLogin.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {},
  onLoad(op) {},
  cancel() {
    wx.navigateBack()
  },
  getUserInfo(e) {
    let that = this;
    wx.login({
      success: function (msg) {
        var codeText = msg.code;
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: msg => {
                  var encryptedData = msg.encryptedData;
                  var iv = msg.iv;
                  util.http('login', { code: codeText, encryptedData: encryptedData, iv: iv }, 'get').then(data => {
                    if (data.code == 200) {
                      app.globalData.userInfo = e.detail.userInfo;
                      app.globalData.state = 1;
                      app.globalData.token = data.data.token;
                      wx.setStorage({
                        key: "httpClient",
                        data: {
                          userInfo:e.detail.userInfo,
                          state :1,
                          token: data.data.token
                        }
                      })
                      wx.showToast({
                        title: '登陆成功',
                        icon:"success",
                        duration:1000
                      })
                      setTimeout(() => {
                        wx.reLaunch({
                          url: '../index/index'
                        })
                      }, 500)
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  }
})