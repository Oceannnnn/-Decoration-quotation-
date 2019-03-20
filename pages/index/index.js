//index.js
const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    imgUrls: [],
    city:'',
    area:'',
    decorate_level:'',
    index:-2,
    multiIndex: [0, 0],
    levelArray: [],
    levelIndex:-1
  },
  onLoad() {
    this.init()
  }, 
  init(){
    this.getCompanyConfig();
    util.shareText();
    util.http('house_type', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          houseArr: res.data
        })
      }
    })
    util.http('getAd', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          imgUrls: res.data
        })
      }
    })
    util.http('decoreate_level', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          levelArray: res.data
        })
      }
    })
    util.http('getArea', {}, 'get').then(res => {
      if (res.code == 200) {
        this.setData({
          multiArray: res.multiArray,
          objectMultiArray: res.objectMultiArray,
        })
      }
    })
  },
  bindMultiPickerChange(e) {
    let multiArray = this.data.multiArray;
    this.setData({
      index: 0,
      "multiIndex[0]": e.detail.value[0], 
      "multiIndex[1]": e.detail.value[1],
      city: multiArray[1][e.detail.value[1]]
    })
  },
  bindMultiPickerColumnChange(e) { 
    debugger
    var list = [];
    switch (e.detail.column) { 
      case 0: list = [];
        for (var i = 0; i < this.data.objectMultiArray.length; i++) { 
          if (this.data.objectMultiArray[i].parid == this.data.objectMultiArray[e.detail.value].regid) { 
            list.push(this.data.objectMultiArray[i].regname) 
        } 
      } 
      this.setData({ 
        "multiArray[1]": list, 
        "multiIndex[0]": e.detail.value, 
        "multiIndex[1]": 0
      })
    }
  },
  bindLevelChange(e){
    let value = e.detail.value;
    this.setData({
      levelIndex: value
    })
    let levelArray = this.data.levelArray;
    let id = levelArray[value].id;
    this.setData({
      decorate_level: id
    })
  },
  bindtap(e){
    let index = e.currentTarget.dataset.index;
    let houseArr = this.data.houseArr;
    for(var i= 0;i<houseArr.length;i++){
      houseArr[i].focus = false;
    }
    houseArr[index].focus = true;
    this.setData({
      houseArr: houseArr
    })
  },
  bindHouse(e) {
    let houseArr = this.data.houseArr; 
    let idx = e.currentTarget.dataset.index;
    let max_num = e.currentTarget.dataset.max_num;
    let value = Number(e.detail.value);
    if (value <= max_num) {
      houseArr[idx].number = value;
    } else if (value > max_num){
      houseArr[idx].number = max_num;
      wx.showToast({
        title: '最多不超过' + max_num,
        icon:'none'
      })
    }
    this.setData({
      houseArr: houseArr
    })
  },
  bindArea(e) {
    this.setData({
      area: e.detail.value
    })
  },
  next() {
    if (app.globalData.state == 1) {
      let houseArr = this.data.houseArr;
      let city = this.data.city;
      let area = this.data.area;
      let decorate_level = this.data.decorate_level;
      if (city == ""){
        wx.showToast({
          title: '请选择城市！',
          icon:'none'
        })
        return
      } else if (area == "") {
        wx.showToast({
          title: '请填写面积！',
          icon: 'none'
        })
        return
      }
      for (var i = 0; i < houseArr.length; i++) {
        if (houseArr[i].number == '') {
          wx.showToast({
            title: '请输入厅室',
            icon: 'none'
          })
          return
        }
      } 
      if (decorate_level == "") {
        wx.showToast({
          title: '请选择装修档次',
          icon: 'none'
        })
        return
      }
      let token = app.globalData.token;
      let house_param = JSON.stringify(houseArr);
      util.http('house_type_param', { house_param: house_param}, 'post',token).then(res => {
        if (res.code == 200) {
          let info = JSON.stringify(res.data);
          wx.navigateTo({
            url: '../area/area?info=' + info + '&city=' + city + '&area=' + area + '&decorate_level=' + decorate_level,
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../toLogin/toLogin',
      })
    }
  },
  getCompanyConfig() {
    let token = app.globalData.token;
    util.http('getConfig', {}, 'get', token).then(res => {
      if (res.code == 200) {
        let info = res.data;
        app.globalData.address = info.address;
        app.globalData.latitude = info.latitude;
        app.globalData.longitude = info.longitude;
        app.globalData.name = info.name;
        app.globalData.phone = info.phone;
        app.globalData.logo = info.logo;
      }
    })
  },
  onShareAppMessage() {
    let text = app.globalData.shareText;
    return {
      title: text,
      path: '/pages/index/index'
    }
  }
})
