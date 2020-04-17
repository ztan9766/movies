// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((r, j) => {
    db.collection('comments').aggregate().match({
      status: _.eq('1')
    }).sample({
      size: 1
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
    }).end().then(res => {
      r(res.list[0])
    }).catch(err => {
      j(err)
    })
  })

}