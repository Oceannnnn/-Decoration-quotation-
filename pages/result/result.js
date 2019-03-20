// pages/result/result.js
Page({
  data: {},
  onLoad(op) {
    this.setData({
      result: op.result
    })
    if (op.trade_no){
      this.setData({
        trade_no: op.trade_no
      })
    }
  },
  bindtap(){
    if(this.data.result==1){
      let trade_no = this.data.trade_no;
      wx.navigateTo({
        url: '../details/details?trade_no=' + trade_no
      })
    }else{
      wx.navigateBack()
    }
  }
})