// pages/area/area.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {},
  onLoad(op) {
    let info = JSON.parse(op.info)
    this.setData({
      list: info,
      city: op.city,
      area: op.area,
      decorate_level: op.decorate_level
    })
  },
  bindinput(e){
    let list = this.data.list;
    let idx = e.currentTarget.dataset.index;
    let value = e.detail.value;
    list[idx].area = value
    this.setData({
      list: list
    })
  },
  next() {
    this.setData({
      disabled: true
    })
    let list = this.data.list;
    let city = this.data.city;
    let area = this.data.area;
    let decorate_level = this.data.decorate_level;
    for (var i = 0; i < list.length; i++) {
      if (list[i].area == '') {
        wx.showToast({
          title: '请输入面积',
          icon: 'none'
        })
        return
      }
    }
    let token = app.globalData.token;
    let house_json = JSON.stringify(list);
    let json = {
      city: city, 
      area: area, 
      decorate_level:decorate_level, 
      house_json: house_json
    }
    let that = this;
    util.http('pay', json, 'post', token).then(res => {
      if (res.code == 200) {
        let trade_no = res.data.trade_no;
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            that.setData({
              disabled: false
            })
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000,
              success: function () {
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../result/result?result=1&trade_no=' + trade_no,
                  })
                }, 500)
              }
            })
          },
          'fail': function (res) {
            setTimeout(() => {
              wx.navigateTo({
                url: '../result/result?result=0',
              })
            }, 500)
          }
        })
      }else if(res.code==0){
        wx.showModal({
          content: res.msg
        })
      }
    })
  }
})