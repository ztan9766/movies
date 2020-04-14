// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return new Promise((resolve, rejected) => {
    db.collection('users').where({
      openid: wxContext.OPENID
    }).get().then(res => {
      console.log(res)
      db.collection('likes').aggregate().match({
        userId: _.eq(res.data[0]._id)
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
      }).end().then(resp => {
        resolve(resp)
      }).catch(err2 => {
        rejected(err2)
      })
    }).catch(err1 => {
      rejected(err1)
    })
  })
}