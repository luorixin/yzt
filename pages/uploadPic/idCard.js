// pages/uploadPic/idCard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idcard_back:'../../src/image/idcard_back.png',
    idcard_tip: '../../src/image/idcard_tip.png',
    idcard_face:'../../src/image/idcard_face.png',
    idcard_img:'../../src/image/idcard_back.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
        that.setData({
          idcard_img: that.data.idcard_face
        })
      }
    }else{
      //上传
      
      wx.redirectTo({
        url: '../uploadPic/business/licence',
      })
    }

  },
})