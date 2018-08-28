// pages/reexamine/auth/index.js
import util from '../../../utils/util.js'
import config from '../../../utils/config.js'
var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_certificate_pic:'',
    hasChoose: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loanPerson = App.HttpResource('/loanPerson/:id', { id: '@id' })
    this.initData();
  },
  initData:function(){
    let loanPersonId = wx.getStorageSync('loanPersonId');
    let me = this;
    me.loanPerson.getAsync({ id: loanPersonId })
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          let company_certificate_pic = data.data.company_certificate_pic ? (config.fileBasePath + '/' + data.data.company_certificate_pic) : ''
          me.setData({
            company_certificate_pic: company_certificate_pic,
          })
        }
      })
      .catch(err => console.log(err))
  },
  /**
   * 选择图片
   */
  chooseImg: function (e) {
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (e) {
        console.log(e.tempFilePaths[0])
       
        that.setData({
          company_certificate_pic: e.tempFilePaths[0],
          hasChoose: true
        })
        

        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
      },
    })
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    let that = this;
    const params = this.data.company_certificate_pic
    console.log(params)
    if (this.data.company_certificate_pic == '') {
      wx.showModal({
        title: '友情提示',
        content: `请上传企业授权书`,
        showCancel: !1,
      })
      return false
    } else {
      //重新选择需要重新上传
      if (this.data.hasChoose) {
        //上传
        let formData = {
          model: 'loanPerson',
          model_id: wx.getStorageSync('loanPersonId'),
          model_name: 'company_certificate_pic'
        }
        util.uploadFile(that.data.company_certificate_pic, formData)
          .then(function (res) {
            res = JSON.parse(res)
            console.log(res)
            wx.navigateTo({
              url: '../../result/index',
            })
          })
          .catch(function (res) {
            wx.showModal({
              title: '友情提示',
              content: '上传或者解析发生错误，请重新上传',
              showCancel: false
            })
          })
      } else {
        wx.navigateTo({
          url: '../../result/index',
        })
      }
    }

  },
})