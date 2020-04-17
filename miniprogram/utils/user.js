export const login = (userInfo) => {
  return new Promise((r, j) => {
    wx.cloud.callFunction({
      name: 'login',
      data: userInfo
    }).then(res => {
      r(res)
    }).catch(err => {
      console.error(err)
      j(err)
    })
  })
}