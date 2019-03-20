const app = getApp()
Page({
  data: {
  },
  onLoad() {
    this.setData({
      name: app.globalData.name,
      phone: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      logo: app.globalData.logo,
      markers: [{
        iconPath: "../../images/add.png",
        id: 0,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        width: 30,
        height: 30
      }]
    })
  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },
  toPosition() {
    wx.openLocation({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      name: this.data.address,
      scale: 15
    })
  }
})