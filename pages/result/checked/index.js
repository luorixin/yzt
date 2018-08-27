// pages/result/checked/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  next: function () {
    wx.redirectTo({
      url: '../../result/payed/index',
    })
  }
})