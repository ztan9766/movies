// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    length,
    description,
    src = '',
    type,
    movieId
  } = event.data

  if(!movieId || movieId === '') return -1

  const user = await db.collection('users').where({
    openid: wxContext.OPENID
  }).get()

  return new Promise((resolve, rejected) => {
    if (movieId) {
      db.collection('comments').add({
          data: {
            description,
            length,
            type,
            movieId,
            src,
            userId: user.data[0]._id,
            status: '0'
          }
        })
        .then((res) => {
          resolve({
            movieId,
            _id: res._id
          })
        })
        .catch(err => {
          rejected(err)
        })
    } else {
      rejected('无电影ID')
    }
  })
}