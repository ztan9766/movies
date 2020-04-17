// components/login/login.js
import {
  login
} from '../../utils/user'

const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTapLogin(event) {
      wx.showLoading({
        title: '登录中',
      })
      
      login(event.detail.userInfo).then(res => {
        const detail = {
          userInfo: res.result
        }
        wx.setStorage({
          key: 'userInfo',
          data: JSON.stringify(res.result)
        })
        
        this.triggerEvent('onLogin', detail)
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        wx.hideLoading()
      })
    },
  }
})