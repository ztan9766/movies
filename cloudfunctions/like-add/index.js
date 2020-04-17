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
    userId,
    commentId
  } = event

  return new Promise((resolve, rejected) => {
    db.collection('likes').where({
      userId,
      commentId
    }).get().then(res => {
      console.log(res)
      if (res.data.length === 0) {
        db.collection('likes').add({
          data: {
            userId,
            commentId
          }
        }).then(() => {
          resolve('添加成功')
        }).catch(() => {
          rejected('添加失败')
        })
      } else {
        resolve('已存在')
      }
    })
  })
}