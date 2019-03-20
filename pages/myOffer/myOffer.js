// pages/myOffer/myOffer.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
  data: {
    currentId: 1,
    HeaderList: [{
      name: "未付款",
      id: 1
    }, {
      name: "已完成",
      id: 2
    }],
    list: [],
    page: 1,
    onBottom: true, 
    hiddenmodalput: true
  },
  onLoad(options) {
    this.list(1, 1);
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      list: [],
      page: 1,
      onBottom: true,
      currentId: id
    })
    this.list(1, id);
  },
  list(page, status) {
    let json = {
      page:page,
      limit:10,
      status: status
    }
    let list = this.data.list;
    let token = app.globalData.token;
    util.http('myOrder', json, 'post', token).then(res => {
      if (res.code == 200) {
        if (res.data != '') {
          for (let item of res.data) {
            list.push(item)
          }
          this.setData({
            list: list
          })
        } else {
          if (page > 1) {
            this.data.onBottom = false;
          }
        }
      }
    })
  },
  onReachBottom() {
    let page = this.data.page + 1;
    this.setData({
      page: page
    })
    if (this.data.onBottom) {
      this.list(this.data.page, this.data.currentId);
    }
  },
  bindtap(e) {
    let order_no = e.currentTarget.dataset.order_no;
    if (this.data.currentId == 2){
      wx.navigateTo({
        url: '../details/details?trade_no=' + order_no,
      })
    }else{
      this.setData({
        disabled: true
      })
      let token = app.globalData.token;
      let that = this;
      util.http('payOrder', { order_id: order_no}, 'post', token).then(res => {
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
        }
      })
    }
  },
  // 点击按钮痰喘指定的hiddenmodalput弹出框  
  sendEmail (e) {
    this.setData({
      order_no: e.currentTarget.dataset.order_no
    })
    this.cancel()
  },
  //取消按钮  
  cancel() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      email: ''
    });
  },
  bindEmail(e){
    let email = e.detail.value;
    this.setData({
      email: email
    })
  },
  //确认  
  confirm() {
    let token = app.globalData.token;
    let email = this.data.email;
    let order_no = this.data.order_no;
    if (!this.check(email))return;
    util.http('sendEmail', { order_no: order_no, email: email}, 'post', token).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '发送成功',
        })
        this.cancel()
      }
    })
  },
  check(value){
　　var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    if (value === "") { //输入不能为空
      wx.showToast({
        title: '不能为空',
        icon:'none'
      })
　　　　return false;
  　} else if (!reg.test(value)) { //正则验证不通过，格式不对
      wx.showToast({
        title: '输入不正确',
        icon: 'none'
      })
　　　　return false;
　　} else {
　　　　return true;
  　}
  }
})