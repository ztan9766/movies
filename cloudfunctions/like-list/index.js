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
  return new Promise((resolve, rejected) => {
    db.collection('likes').aggregate().match({
      userId: _.eq(userId)
    }).lookup({
      from: 'comments',
      localField: 'commentId',
      foreignField: '_id',
      as: 'comment'
    }).lookup({
      from: 'users',
      localField: 'comment.userId',
      foreignField: '_id',
      as: 'user'
    }).lookup({
      from: 'movies',
      localField: 'comment.movieId',
      foreignField: '_id',
      as: 'movie'
    }).end().then(res => {
      resolve(res)
    }).catch(err => {
      rejected(err)
    })
  })
}