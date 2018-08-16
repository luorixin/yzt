// pages/uploadPic/idCard.js
import ImgToBasePlugin from '../../helpers/ImgToBasePlugin.js'

const App = getApp()

const canvasID = 'scannerCanvas'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idcard_back:'../../src/image/idcard_back.png',
    idcard_tip: '../../src/image/idcard_tip.png',
    idcard_face:'../../src/image/idcard_face.png',
    idcard_img:'../../src/image/idcard_back.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

  },

  /**
   * 选择图片
   */
  chooseIdCard: function(){
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(e) {
        console.log(e.tempFilePaths[0])
        if (that.data.idcard_img != '../../src/image/idcard_face.png'){
          that.setData({
            idcard_back: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
          })
        }else{
          that.setData({
            idcard_face: e.tempFilePaths[0],
            idcard_img: e.tempFilePaths[0],
          })
        }
        
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
    console.log(that.data)
    if (that.data.idcard_back == '../../src/image/idcard_back.png' || that.data.idcard_face == '../../src/image/idcard_face.png') {
      //背面选择完成
      if (that.data.idcard_back != '../../src/image/idcard_back.png'){
        //解析背面
        new ImgToBasePlugin(that.data.idcard_back, canvasID, 'back', 'idcard')
          .on('DecodeComplete', (res) => {
            if (res.code == 0) {
              console.log(res.data)
              wx.setStorage({
                key: 'end_date',
                data: res.data.end_date
              })
              wx.setStorage({
                key: 'start_data',
                data: res.data.start_data
              })
              wx.setStorage({
                key: 'partement',
                data: res.data.partement
              })
              that.setData({
                idcard_img: that.data.idcard_face
              })
            } else {
              wx.showModal({
                title: '友情提示',
                content: '解析发生错误，请重新上传',
                showCancel: false
              })
            }
          })
        
      }else{
        wx.showModal({
          title: '友情提示',
          content: '请先上传身份证',
          showCancel:false
        })
      }
    }else{
      //上传
      //解析正面
      new ImgToBasePlugin(that.data.idcard_face, canvasID, 'front', 'idcard')
        .on('DecodeComplete', (res) => {
          if (res.code == 0) {
            console.log(res.data)
            wx.setStorage({
              key: 'address',
              data: res.data.address
            })
            wx.setStorage({
              key: 'card_id',
              data: res.data.card_id
            })
            wx.setStorage({
              key: 'birth',
              data: res.data.birth
            })
            wx.setStorage({
              key: 'name',
              data: res.data.name
            })
            wx.setStorage({
              key: 'gender',
              data: res.data.gender
            })
            wx.setStorage({
              key: 'nation',
              data: res.data.nation
            })
            wx.redirectTo({
              url: '../uploadPic/business/licence',
            })
          } else {
            wx.showModal({
              title: '友情提示',
              content: '解析发生错误，请重新上传',
              showCancel: false
            })
          }
        })
    }
  },
  
})