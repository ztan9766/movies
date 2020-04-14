// miniprogram/pages/comment/list/list.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    movieId: '',
    list: [],
    avatar: '../../../static/user-unlogin.png',
    playingIndex: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(options.movieId)
    this.setData({
      movieId: options.movieId
    })
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
    this.setData({
      current: 1
    })
    this.loadData(this.data.movieId)
  },

  loadData(movieId) {
    wx.cloud.callFunction({
        name: 'comment',
        data: {
          type: 1,
          movieId,
          pageSize: 10,
          current: this.data.current
        },
      })
      .then(res => {
        const list = this.data.list
        this.setData({
          list: list.concat(res.result.list)
        })
      })
      .catch(console.error)
  },

  play(e) {
    const index = e.target.dataset.index
    const item = this.data.list[index]
    if (this.innerAudioContext.src !== item.src) {
      this.innerAudioContext.src = item.src
    }
    this.innerAudioContext.play()
    this.setData({
      playingIndex: index
    })

  },

  pause() {
    this.innerAudioContext.pause()
    this.setData({
      playingIndex: ''
    })
  },

  backHome() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
})