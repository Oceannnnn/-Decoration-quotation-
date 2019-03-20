// pages/smallRoutine/smallRoutine.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
  },
  onLoad: function (options) {
    this.animation = wx.createAnimation()
    this.rotate();
    util.http('returnPhone', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          user_phone: res.data.phone
        })
      }
    })
  },
  rotate: function () {
    var circleCount = 0;
    // 心跳的外框动画  
    this.animationMiddleHeaderItem = wx.createAnimation({
      duration: 1000,    // 以毫秒为单位  
      timingFunction: 'linear',
      delay: 100,
      transformOrigin: '50% 50%',
      success: function (res) {
      }
    });
    setInterval(function () {
      if (circleCount % 2 == 0) {
        this.animation.rotate(30).step();
      } else {
        this.animation.rotate(-10).step();
      }
      this.setData({ animation: this.animation.export() })
      circleCount++;
      if (circleCount == 1000) {
        circleCount = 0;
      }
    }.bind(this), 200);
  },
  call() {
    let phoneNumber = app.globalData.phone;
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindtap() {
    let name = this.data.name;
    let phone = this.data.phone;
    if (!name) {
      wx.showToast({
        title: '请输入名字',
        icon: "none"
      })
      return
    } else if (!phone) {
      wx.showToast({
        title: '请输入电话',
        icon: "none"
      })
      return
    }
    if (!util.toCheck(phone)) {
      wx.showToast({
        title: '请输入正确电话',
        icon: "none"
      })
      return
    }
    let token = app.globalData.token;
    util.http('makeProgram', { name: name, phone: phone }, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          name:'',
          phone:''
        })
        wx.showModal({
          content: '发送成功，客服会在一天内回复您！',
          confirmText: "返回首页",
          confirmColor: "#5E83C5",
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        })
      }
    })
  }
})