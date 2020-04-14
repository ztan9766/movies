// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const wxContext = cloud.getWXContext()
const _ = db.command

// 根据电影ID分页查找评论
const list = (params) => {
  const {
    pageSize = 10,
      current = 1,
      movieId
  } = params
  if (!movieId) return ''
  return db.collection('comments').aggregate().match({
    movieId: _.eq(movieId),
    status: _.eq('1')
  }).limit(pageSize).skip((current - 1) * pageSize).lookup({
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user'
  }).end()
}

// 返回随机的影评并且带有该影片相关的电影及用户信息
const random = () => {
  return db.collection('comments').aggregate().match({
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
  }).end()
}

const detail = (params) => {
  return db.collection('comments').aggregate().match({
    _id: _.eq(params.id)
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

const mine = async () => {
  const user = await db.collection('users').where({
    openid: wxContext.OPENID
  }).get()

  console.log(user)
  return db.collection('comments').aggregate().match({
    userId: _.eq(user.data[0]._id)
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

// type === 0 随机获取评论
// type === 1 根据movie Id获取分页评论列表
// type === 2 根据comment Id获取评论详情
// type === 3 根据用户获取所有该用户的评论

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    type
  } = event

  switch (type) {
    case 0:
      return random()
    case 1:
      return list(event)
    case 2:
      return detail(event)
    case 3:
      return mine()
    default:
      return new Promise((res, rej) => {
        rej()
      })
  }
}