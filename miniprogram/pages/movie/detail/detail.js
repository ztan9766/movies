// miniprogram/pages/movie/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    showActionsheet: false,
    movie: {},
    groups: [{
        text: '文字',
        value: 0
      },
      {
        text: '音频',
        value: 1
      }
    ]
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadData()
  },

  loadData() {
    wx.cloud.callFunction({
        name: 'movie',
        data: {
          type: 0,
          id: this.data.id
        },
      })
      .then(res => {
        console.log(res)
        this.setData({
          movie: res.result.data[0]
        })
      })
      .catch(console.error)
  },
  handleAdd() {
    this.setData({
      showActionsheet: true
    })
  },
  handleView() {
    if (this.data.movie) {
      wx.navigateTo({
        url: '/pages/comment/list/list?movieId=' + this.data.movie._id
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
      url: '/pages/comment/edit/edit?type=' + e.detail.value + '&movieId=' + this.data.movie._id,
    })
    this.close()
  }
})