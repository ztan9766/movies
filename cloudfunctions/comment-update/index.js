// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const params = event.data

  if (params.status === '0' && (!params || !params.movieId || params.movieId === '')) return -1
  return new Promise((resolve, rejected) => {
    db.collection('comments').doc(event._id).update({
      data: params
    }).then(() => {
      resolve({
        _id: event._id
      })
    }).catch(err => {
      rejected(err)
    })
  })
}