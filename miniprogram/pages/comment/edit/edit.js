// miniprogram/pages/comment/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: '',
    movieId: '',
    movie: {},
    textValue: '',
    isPlay: false,
    isRecord: false,
    tempPath: '',
    recordTimer: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.movieId || '',
      type: options.type || '',
      id: options.id || ''
    })
    console.log(options)
    if (this.data.id !== '') {
      this.loadComment()
    } else {
      this.loadData()
    }

  },

  onShow() {
    this.innerAudioContext = wx.createInnerAudioContext()
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onStop(res => {
      this.setData({
        tempPath: res.tempFilePath,
        isRecord: false
      })
      this.timerStop()
      this.innerAudioContext.src = res.tempFilePath
    })
    this.recorderManager.onStart(() => {
      this.setData({
        recordTimer: 0,
        tempPath: '',
        isRecord: true
      })
      this.innerAudioContext.src = ''
      this.timerStart()
    })
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
        name: 'movie-detail',
        data: {
          id: this.data.movieId
        },
      })
      .then(res => {
        this.setData({
          movie: res.result.data[0]
        })
      })
      .catch(console.error)
  },

  loadComment() {
    wx.cloud.callFunction({
        name: 'comment-detail',
        data: {
          id: this.data.id
        },
      })
      .then(res => {
        const _comment = res.result.list[0]
        console.log(res)
        this.setData({
          movie: _comment.movie[0],
          textValue: _comment.description,
          tempPath: _comment.src,
          recordTimer: _comment.length,
          type: _comment.type
        })
      })
      .catch(console.error)
  },

  bindFormSubmit(e) {
    const description = e.detail.value.textarea || ''
    const timestamp = new Date().getTime()
    const formData = {
      length: this.data.recordTimer,
      type: this.data.type || this.data.movie.type,
      movieId: this.data.movieId || this.data.movie._id,
      description
    }
    // 如果录音地址没有被本地素材替代则不需要上传
    if (formData.type === '1' && this.data.tempPath.indexOf('cloud://') < 0) {
      wx.cloud.uploadFile({
        filePath: this.data.tempPath,
        cloudPath: 'movies/records/' + timestamp + '.acc',
      }).then(res => {
        formData.src = res.fileID
        this.handleSave(formData)
      }).catch(error => {
        console.log(error)
      })
    } else {
      this.handleSave(formData)
    }

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

  handleRecord() {
    this.recorderManager.start()
  },

  handleStop() {
    this.recorderManager.stop()
  },

  timerStart() {
    this.interval = setInterval(
      () => {
        this.setData({
          recordTimer: this.data.recordTimer + 1
        })
      }, 1000);
  },
  timerStop() {
    clearInterval(this.interval)
  },

  handleSave(formData) {
    const cloundFncName = this.data.id && this.data.id !== '' ? 'comment-update' : 'comment-add'
    wx.cloud.callFunction({
        name: cloundFncName,
        data: {
          _id: this.data.id,
          data: formData
        },
      })
      .then(res => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/comment/preview/preview?id=' + res.result._id,
        })
      })
      .catch(console.error)
  }
})