// pages/uploadPic/business/licence.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    licence_img: '../../../src/image/licence.png',
    kaihu_img:'',
    jinying_img:'',
    showLicence: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
          licence_img: e.tempFilePaths[0],
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
    let id = e.target.id;
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (e) {
        if(id=='kaihu'){
          that.setData({
            kaihu_img: e.tempFilePaths[0],
          })
        }else{
          that.setData({
            jinying_img: e.tempFilePaths[0],
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

        that.setData({
          showLicence: false
        })
      }else{
        //上传资质证明
        if (that.data.kaihu_img == '' || that.data.jinying_img == ''){
          wx.showModal({
            title: '友情提示',
            content: '请上传资质证明',
            showCancel: false
          })
        }else{
          //上传

          wx.redirectTo({
            url: '../infoConfirm/personInfo',
          })
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
})