// miniprogram/pages/mine/mine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: '',
    list: [],
    mineList: [],
    playingIndex: '',
    avatar: '../../static/user-unlogin.png',
    checked: '1',
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = JSON.parse(wx.getStorageSync('userInfo') || "{}")
    this.setData({
      userInfo 
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  loadData() {
    if (!this.data.userInfo || !this.data.userInfo._id) return
    this.loadLike()
    this.loadMine()
  },

  loadLike() {
    wx.cloud.callFunction({
        name: 'like-list',
        data: this.data.userInfo
      })
      .then(res => {
        console.log(res)
        this.setData({
          list: res.result.list
        })
      })
      .catch(console.error)
  },

  loadMine() {
    wx.cloud.callFunction({
        name: 'comment-mine',
        data: this.data.userInfo
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
  },

  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
    this.loadData()
  }
})