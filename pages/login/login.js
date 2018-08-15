// pages/login/login.js
const util = require('../../utils/util.js')
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRegister:false,
    phone:"",
    password:"",
    code:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.WxValidate = App.WxValidate({
      phone: {
        required: true,
        tel: true,
      },
      password: {
        required: true,
        minlength: 2,
        maxlength: 100,
      },
    }, {
        phone: {
          required: '请输入11位手机号码',
        },
        password: {
          required: '请输入密码',
        }
      })
  },
  /**
   * 登录
   */
  formSubmit:function(e){
    // form 表单取值，格式 e.detail.value.name(name为input中自定义name值) ；使用条件：需通过<form bindsubmit="formSubmit">与<button formType="submit">一起使用
    let phone = e.detail.value.phone;
    let password = e.detail.value.password;
    let code = e.detail.value.code;
    let subPassword = e.detail.value.subPassword;
    if (this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    }else{
      wx.redirectTo({
        url: '../information/info',
      })
    }
  },
  /**
   * 切换登录注册
   */
  changeToRegister: function(e){
    this.setData({
      showRegister:true
    })
  },
  changeToLogin: function (e) {
    this.setData({
      showRegister: false
    })
  },
})