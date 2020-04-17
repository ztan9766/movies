// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('comments').aggregate().match({
    _id: _.eq(event.id)
  }).lookup({
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user'
  }).lookup({
    from: 'movies',
    localField: 'movieId',
    foreignField: '_id',
    as: 'movie'
  }).end()
}