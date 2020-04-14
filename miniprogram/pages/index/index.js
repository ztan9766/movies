//index.js
const app = getApp()

Page({
  data: {
    recommandation: {},
    avatar: '../../static/user-unlogin.png'
  },
  onLoad: function () {
    this.loadData()
    this.login()
  },
  onPullDownRefresh: function () {
    this.loadData()
  },
  loadData() {
    // 随机拉取一个评论作为封面
    wx.cloud.callFunction({
        name: 'comment',
        data: {
          type: 0
        },
      })
      .then(res => {
        this.setData({
          recommandation: res.result.list[0]
        })
      })
      .catch(console.error)
  },
  handleTapCover() {
    if (this.data.recommandation) {
      wx.navigateTo({
        url: '/pages/movie/detail/detail?id=' + this.data.recommandation.movie[0]._id
      })
    }
  },
  handleTapComment() {
    if (this.data.recommandation) {
      wx.navigateTo({
        url: '/pages/comment/detail/detail?id=' + this.data.recommandation._id
      })
    }
  },
  login() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
    })
    .then(res => {
      console.log(res)
    })
    .catch(console.error)
  }
})