const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const u = "https://account.fqwlkj.cn/api/"
const http = (url, data = {}, method = 'get', token = '') => {
  const allUrl = u + url;
  return new Promise(function (resolve, reject) {
    wx.request({
      url: allUrl,
      data: data,
      method: method ? method : 'get',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        key: token
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (res) => {
        reject(res.data)
      }
    })
  })
}

const shareText = () => {
  http('share ', {}, 'get').then(res => {
    if (res.code == 200) {
      app.globalData.shareText = res.data.share
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http: http,
  shareText: shareText
}
