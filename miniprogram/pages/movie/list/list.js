// miniprogram/pages/movieList/movieList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1,
    hasMore: true,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      current: 1,
      hasMore: true,
      list: []
    })
    this.loadData()
  },

  onReachBottom: function () {
    if (this.data.hasMore) {
      this.setData({
        current: this.data.current + 1
      })
      this.loadData()
    }
  },

  loadData() {
    wx.cloud.callFunction({
        name: 'movie',
        data: {
          type: 1,
          pageSize: 10,
          current: this.data.current
        },
      })
      .then(res => {
        if (res.result.data.length === 0) {
          this.setData({
            hasMore: false
          })
          return
        }
        const list = this.data.list
        this.setData({
          list: list.concat(res.result.data)
        })
      })
      .catch(console.error)
  },

  handleDetail(e) {
    wx.navigateTo({
      url: '/pages/movie/detail/detail?id=' + e.currentTarget.id
    })
  }
})