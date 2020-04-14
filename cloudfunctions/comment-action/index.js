// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const wxContext = cloud.getWXContext()

const addComment = async (event) => {
  const {
    length,
    description,
    src = '',
    type,
    movieId
  } = event

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
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          rejected(err)
        })
    } else {
      rejected('无电影ID')
    }
  })
}

const updateComment = (event) => {
  try {
    return new Promise((resolve, rejected) => {
      db.collection('comments').doc(event._id).update({
        data: event
      }).then(res => {
        resolve({
          _id: event._id
        })
      })
    })
  } catch (e) {
    console.error(e)
  }

}

// 云函数入口函数
exports.main = async (event, context) => {
  // 当有_id参数时更新已存在的评论记录
  return event._id && event._id !== '' ? updateComment(event) : addComment(event)
}