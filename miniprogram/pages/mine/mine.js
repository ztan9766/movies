// miniprogram/pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    mineList: [],
    playingIndex: '',
    avatar: '../../static/user-unlogin.png',
    checked: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
    this.loadMine()
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
    this.loadMine()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  loadData() {
    wx.cloud.callFunction({
        name: 'like',
        data: {},
      })
      .then(res => {
        this.setData({
          list: res.result.list
        })
      })
      .catch(console.error)
  },

  loadMine() {
    wx.cloud.callFunction({
        name: 'comment',
        data: {
          type: 3
        },
      })
      .then(res => {
        this.setData({
          mineList: res.result.list
        })
      })
      .catch(console.error)
  },

  backHome() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  pause() {
    this.innerAudioContext.pause()
    this.setData({
      playingIndex: ''
    })
  },

  play(e) {
    const index = e.target.dataset.index
    const item = this.data.list[index].comment[0]

    this.innerAudioContext.src = item.src
    this.innerAudioContext.play()
    this.setData({
      playingIndex: index
    })

  },

  playMine(e) {
    const index = e.target.dataset.index
    let item = {}
    this.data.mineList.map(e => {
      if (e._id === index) {
        item = e
      }
    })

    this.innerAudioContext.src = item.src
    this.innerAudioContext.play()
    this.setData({
      playingIndex: index
    })

  },

  radioChange(e) {
    this.setData({
      checked: e.detail.value
    })
  },

  goDetail(e) {
    wx.navigateTo({
      url: '/pages/comment/detail/detail?id=' + e.currentTarget.dataset.commentId,
    })
  }
})