// pages/processing/finish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  next: function(){
    wx.redirectTo({
      url: '../../reexamine/index',
    })
  }
})