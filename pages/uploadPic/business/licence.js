// pages/uploadPic/business/licence.js
import util from '../../../utils/util.js'
import config from '../../../utils/config.js'

const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_licence: '../../../src/image/licence.png',
    opening_permission:'',
    business_permission:'',
    hasChooseLicence:false,
    hasChooseOpening:false,
    hasChooseBusiness:false,
    showLicence: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let me = this;
    me.loanCompany = App.HttpResource('/loanCompany/:id', { id: '@id' })
    me.initData();
  },

  initData: function () {
    let loanCompanyId = wx.getStorageSync('loanCompanyId');
    let me = this;
    me.loanCompany.getAsync({ id: loanCompanyId })
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          let business_licence = data.data.business_licence ? (config.fileBasePath + '/' + data.data.business_licence) : '../../../src/image/licence.png';
          let opening_permission = data.data.opening_permission ? (config.fileBasePath + '/' + data.data.opening_permission) : ''
          let business_permission = data.data.business_permission ? (config.fileBasePath + '/' + data.data.business_permission) : ''
          me.setData({
            business_licence: business_licence,
            opening_permission: opening_permission,
            business_permission: business_permission,
          })
        }
      })
      .catch(err => console.log(err))
  },

  /**
   * 选择营业执照
   */
  chooseLicence: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (e) {
        console.log(e.tempFilePaths[0])

        that.setData({
          business_licence: e.tempFilePaths[0],
          hasChooseLicence:true,
        })

        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
        //上传

      },
    })
  },
  /**
   * 选择资质证明
   */
  chooseCredentials: function(e){
    let id = e.currentTarget.id;
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (e) {
        if (id =='opening_permission'){
          that.setData({
            opening_permission: e.tempFilePaths[0],
            hasChooseOpening: true,
          })
        }else{
          that.setData({
            business_permission: e.tempFilePaths[0],
            hasChooseBusiness: true,
          })
        }
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
        //上传

      },
    })
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    let that = this;
    console.log(that.data)
    if (that.data.licence_img != '../../../src/image/licence.png') {
      //上传
      if (that.data.showLicence){
        //上传营业执照
        //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程
        if (!that.data.hasChooseLicence) {
          that.setData({
            showLicence: false
          })
        } else {
          that.loanCompanyUpload(that.data.business_licence, 'business_licence',function(res){
            console.log(res)
            that.setData({
              business_licence: that.data.business_licence,
              showLicence: false
            })
          });
        }
        
      }else{
        //上传资质证明
        if (that.data.opening_permission == '' || that.data.business_permission == ''){
          wx.showModal({
            title: '友情提示',
            content: '请上传资质证明',
            showCancel: false
          })
        }else{
          //上传
          //如果之前已经上传过的，且本次没有重新选择，则跳过上传过程
          if (!that.data.hasChooseOpening && !that.data.hasChooseBusiness) {
            wx.navigateTo({
              url: '../infoConfirm/personInfo',
            })
          } else {
            that.loanCompanyUpload(that.data.opening_permission, 'opening_permission', 
              function (res) {
                that.setData({
                  opening_permission: that.data.opening_permission,
                })
                that.loanCompanyUpload(that.data.business_permission, 'business_permission',
                  function (res) {
                    that.setData({
                      business_permission: that.data.business_permission,
                    })
                    wx.navigateTo({
                      url: '../infoConfirm/personInfo',
                    })
                  });
            });
          }
        }
      }
    }else{
      wx.showModal({
        title: '友情提示',
        content: '请上传营业执照',
        showCancel:false
      })
    }

  },
  //上传
  loanCompanyUpload: function(filePath,model_name,cb){
    let that = this;
    //上传
    let formData = {
      model: 'loanCompany',
      model_id: wx.getStorageSync('loanCompanyId'),
      model_name: model_name
    }
    console.log(filePath, formData)
    util.uploadFile(filePath, formData)
      .then(function (res) {
        cb(res)
      })
      .catch(function (res) {
        wx.showModal({
          title: '友情提示',
          content: '上传发生错误，请重新上传',
          showCancel: false
        })
      })
  }
  
})