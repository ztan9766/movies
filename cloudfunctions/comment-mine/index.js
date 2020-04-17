// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const userId = event._id
  return db.collection('comments').aggregate().match({
    userId: _.eq(userId)
  }).lookup({
    from: 'movies',
    localField: 'movieId',
    foreignField: '_id',
    as: 'movie'
  }).end()
}