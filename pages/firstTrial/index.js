// pages/firstTrial/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  next: function(){
    //检测是否装了插件，假设没通过
    wx.redirectTo({
      url: '../processing/index',
    })
  }
})