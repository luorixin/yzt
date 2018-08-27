// pages/reexamine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loanAccounts:[
      {
        name:'',
        receive_account:'',
        type:'',
        loan_account:'',
        contract_pic:'',
        product_certificate_pic:'',
        loan_percent:100,
      }
    ],
    types:['等额本金','等额本息']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  add: function(){
    let me = this;
    let { loanAccounts } = me.data;
    console.log(loanAccounts)
    loanAccounts.push({
      name: '',
      receive_account: '',
      type: '',
      loan_account: '',
      contract_pic: '',
      product_certificate_pic: '',
      loan_percent: 100,
    })
    me.setData({
      loanAccounts: loanAccounts
    });
  }
  
})