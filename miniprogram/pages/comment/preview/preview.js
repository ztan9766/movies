// miniprogram/pages/comment/preview/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isPlay: false,
    avatar: '../../../static/user-unlogin.png',
    comment: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.loadData()
  },

  onShow() {
    this.innerAudioContext = wx.createInnerAudioContext()
  },

  onHide() {
    this.innerAudioContext.destroy()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData()
  },

  loadData() {
    wx.cloud.callFunction({
        name: 'comment',
        data: {
          type: 2,
          id: this.data.id
        },
      })
      .then(res => {
        this.setData({
          comment: res.result.list[0]
        })
        this.innerAudioContext.src = this.data.comment.src
      })
      .catch(console.error)
  },

  play() {
    this.innerAudioContext.play()
    this.setData({
      isPlay: true
    })

  },

  pause() {
    this.innerAudioContext.pause()
    this.setData({
      isPlay: false
    })
  },

  back() {
    wx.navigateTo({
      url: '/pages/comment/edit/edit?id=' + this.data.id,
    })
  },

  publish() {
    wx.cloud.callFunction({
      name: 'comment-action',
      data: {
        id: this.data.id,
        status: '1'
      },
    })
    .then(() => {
      wx.navigateTo({
        url: '/pages/comment/list/list?movieId=' + this.data.comment.movieId,
      })
    })
    .catch(console.error)
  }
})