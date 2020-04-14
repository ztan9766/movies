// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 根据分页查找电影列表
const list = (params) => {
  const {
    pageSize = 10,
      current = 1,
  } = params
  return db.collection('movies').limit(pageSize).skip((current - 1) * pageSize).get()
}

// 获取电影详情
const detail = (params) => {
  const {
    id
  } = params
  if (!id) return ''
  return db.collection('movies').where({
    _id: id
  }).get()
}

// type === 0 获取电影详情
// type !== 0 获取电影列表

// 云函数入口函数
exports.main = async (event, context) => {
  return event.type === 0 ? detail(event) : list(event)
}