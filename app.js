//app.js
App({
  onLaunch() {
    if (wx.getStorageSync('httpClient').token) {
      this.globalData.state = wx.getStorageSync('httpClient').state;
      this.globalData.token = wx.getStorageSync('httpClient').token;
      this.globalData.userInfo = wx.getStorageSync('httpClient').userInfo;
    }
  },
  globalData: {
    userInfo: null,
    state: 0,
    token: '',
  }
})