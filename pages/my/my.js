// pages/my/my.js
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    state: 0
  },
  onLoad: function () {
  },
  onShow(){
    this.init()
  },
  init() {
    this.setData({
      state: app.globalData.state,
      userInfo: app.globalData.userInfo
    })
  },
  myOffer() {
    if (this.data.state == 1) {
      wx.navigateTo({
        url: '../myOffer/myOffer',
      })
    } else {
      this.toLogin()
    }
  },
  about(e) {
    wx.navigateTo({
      url: '../about/about',
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '../toLogin/toLogin',
    })
  },
  onShareAppMessage(ops) {
    let text = app.globalData.shareText;
    if (ops.from === 'button') { }
    return {
      title: text,
      path: "/pages/index/index"
    }
  }
})