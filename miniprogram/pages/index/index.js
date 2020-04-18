//index.js
const app = getApp()

Page({
  data: {
    recommandation: {},
    avatar: '../../static/user-unlogin.png'
  },
  onLoad: function () {
    this.loadData()
  },
  onPullDownRefresh: function () {
    this.loadData()
  },
  loadData() {
    // 随机拉取一个评论作为封面
    wx.cloud.callFunction({
        name: 'comment-random',
      })
      .then(res => {
        if (res.result && res.result._id) {
          this.setData({
            recommandation: res.result
          })
        }
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
  }
})