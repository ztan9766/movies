//index.js
const app = getApp()

Page({
  data: {
    list: []
  },

  onLoad: function () {},
  jump(i) {
    console.log(i)
    wx.navigateTo({url: 'pages/movie/list/list'})
  },
  tabChange(e) {
    console.log('tab change', e)
  }

})