// miniprogram/pages/comment/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isPlay: false,
    showActionsheet: false,
    avatar: '../../../static/user-unlogin.png',
    comment: {},
    groups: [{
        text: '文字',
        value: 0
      },
      {
        text: '音频',
        value: 1
      }
    ],
    userInfo: {},
    showLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      userInfo: JSON.parse(wx.getStorageSync('userInfo') || '{}')
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
        name: 'comment-detail',
        data: {
          id: this.data.id
        },
      })
      .then(res => {
        console.log(res)
        this.setData({
          comment: res.result.list[0]
        })
        this.innerAudioContext.src = this.data.comment.src || ''
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

  writeComment() {
    this.setData({
      showActionsheet: true
    })
  },

  likeComment() {
    if (this.data.userInfo && this.data.userInfo._id) {
      wx.cloud.callFunction({
          name: 'like-add',
          data: {
            commentId: this.data.comment._id,
            userId: this.data.userInfo._id
          },
        })
        .then(res => {
          console.log(res)
          wx.navigateTo({
            url: '/pages/mine/mine',
          })
        })
        .catch(console.error)
    } else {
      this.setData({
        showLogin: true
      })
    }

  },

  close() {
    this.setData({
      showActionsheet: false
    })
  },

  btnClick(e) {
    wx.navigateTo({
      url: '/pages/comment/edit/edit?type=' + e.detail.value + '&movieId=' + this.data.comment.movieId,
    })
    this.close()
  },

  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo,
      showLogin: false
    })
    this.likeComment()
  }
})