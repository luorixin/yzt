// pages/uploadPic/infoConfirm/personInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    idCard:'',
    companyName:'',
    socialId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let {name ,idCard,companyName,socialId} = that.data;
    idCard = wx.getStorageSync('card_id')
    name = wx.getStorageSync('name')
    companyName = wx.getStorageSync('address')
    socialId = wx.getStorageSync("gender")
    that.setData({
      name: name,
      idCard: idCard,
      companyName: companyName,
      socialId: socialId
    })
  },

  
})