// pages/uploadPic/infoConfirm/personInfo.js

var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    id_card:'',
    company_name:'',
    social_code:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.WxValidate = App.WxValidate({
      social_code: {
        required: true,
        number: true,
      },
      name: {
        required: true,
      },
      company_name: {
        required: true,
      },
      id_card: {
        required: true
      }
    }, {
        social_code: {
          required: '请输入统一社会信用代码',
        },
        name: {
          required: '请输入名字',
        },
        company_name: {
          required: '请输入公司名字'
        },
        id_card: {
          required: '请输入身份证号码'
        }
      })
    
    that.loanPerson = App.HttpResource('/loanPerson/:id', { id: '@id' })
    that.initData();
  },

  initData: function(){
    let that = this;
    let { name, id_card, company_name, social_code } = that.data;
    let data = wx.getStorageSync('personInfo');
    id_card = data.card_id
    name = data.name
    company_name = data.company_name
    social_code = data.social_code
    that.setData({
      name: name,
      id_card: id_card,
      company_name: company_name,
      social_code: social_code,
      _id: wx.getStorageSync('loanPersonId'),
    })
  },

  formSubmit: function(e){
    const params = e.detail.value
    console.log(params)
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    } else {
      this.loanPerson.updateAsync({ id: this.data._id }, params)
        .then(data => {
          if (data.meta.code == 0) {
            wx.showToast({
              title: data.meta.message,
              icon: 'success',
              duration: 1500,
              success: function () {
                wx.navigateTo({
                  url: '../../about/index',
                })
              }
            })
          }
        })
    }
    
  }
  
})