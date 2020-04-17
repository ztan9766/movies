// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    pageSize = 10,
      current = 1,
      movieId
  } = event
  if (!movieId) return ''
  return db.collection('comments').aggregate().match({
    movieId: _.eq(movieId),
    status: _.eq('1')
  }).limit(pageSize).skip((current - 1) * pageSize).lookup({
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user'
  }).end()
}