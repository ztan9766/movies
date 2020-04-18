// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const userId = event.userId
  const movieId = event.movieId
  return new Promise((r, j) => {
    db.collection('comments').aggregate().match({
      userId: _.eq(userId),
      movieId: _.eq(movieId)
    }).end().then(res => {
      if (res.list && res.list.length > 0) {
        r({
          hasComment: true,
          commentId: res.list[0]._id
        })
      } else {
        r({
          hasComment: false
        })
      }
    }).catch(err => {
      j(err)
    })
  })

}