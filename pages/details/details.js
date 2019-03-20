// pages/details/details.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    curIndex:1,
    curNav:0,
    list: [],
    array: [],
    hidden:true
  },
  onLoad(op) {
    this.init(op.trade_no);
  },
  init(trade_no){
    let token = app.globalData.token;
    util.http('reckonPrice', { trade_no: trade_no}, 'post', token).then(res => {
      if (res.code == 200) {
        this.setData({
          sum: res.data.sum,
          pay_money: res.data.pay_money,
          list:res.data.info,
          curIndex: res.data.info[0].id,
          order_id: res.data.order_id
        })
      }
    })
  },
  toList(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: id,
      curNav: index
    })
  },
  bindChange(e) {
    let indexchange = e.currentTarget.dataset.indexchange;
    let brand_id = e.currentTarget.dataset.brand_id;
    let token = app.globalData.token;
    this.setData({
      indexchange: indexchange
    })
    this.cha();
    util.http('getBrand', { cate_id: brand_id }, 'get', token).then(res => {
      if (res.code == 200) {
        this.setData({
          array:res.data
        })
      }
    })
  },
  cha(){
    this.setData({
      hidden:!this.data.hidden
    })
  },
  modifyBtn(e) {
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    let list = this.data.list;
    let curNav = this.data.curNav;
    let indexchange = this.data.indexchange;
    list[curNav].item[indexchange].brand_name = name;
    list[curNav].item[indexchange].brand_id = id;
    this.setData({
      list: list
    })
    this.cha();
  },
  next() {
    this.setData({
      disabled: true
    })
    let list = this.data.list;
    let arr = [];
    for (var i = 0; i < list.length; i++) {
      let json = {}
      json.og_id = list[i].id;
      let arr1 = [];
      for (var j = 0; j < list[i].item.length; j++) {
        let json1 = {}
        json1.brand_id = list[i].item[j].brand_id;
        json1.res_id = list[i].item[j].id;
        arr1.push(json1)
        json.item = arr1;
      }
      arr.push(json)
    }
    arr = JSON.stringify(arr);
    let token = app.globalData.token;
    let order_id = this.data.order_id;
    let that = this;
    util.http('changeBrandPay', { result_json: arr, order_id: order_id }, 'post', token).then(res => {
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
})