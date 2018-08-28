// pages/reexamine/index.js
import util from '../../utils/util.js'
import config from '../../utils/config.js'

var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loanAccounts:[
      {
        name:'',
        receive_account:'',
        type:0,
        loan_account:'',
        contract_pic:'',
        product_certificate_pic:'',
        loan_percent:100,
        loan_person: wx.getStorageSync('loanPersonId')
      }
    ],
    params: {
      page: 1,
      limit: 10,
    },
    paginate: {},
    types:['等额本金','等额本息'],
    hasData:false,
    errorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loanAccount = App.HttpResource('/loanAccount/:id', { id: '@id' })
    this.initData();
  },
  initData:function(){
    let loanAccounts = this.data.loanAccounts;
    let params = this.data.params
    let paginate = this.data.paginate
    let me = this;
    this.setData({
      loan_person: wx.getStorageSync('loanPersonId')
    })
    params.loan_person = this.data.loan_person
    this.loanAccount.queryAsync(params)
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          loanAccounts = [...data.data.items]
          paginate = data.data.paginate
          params.page = data.data.paginate.next
          params.limit = data.data.paginate.perPage
          if (data.data.items.length > 0) {
            for(let item of loanAccounts){
              item.loan_person = this.data.loan_person
            }
            me.setData({
              loanAccounts: loanAccounts,
              params:params,
              paginate: paginate,
              hasData: true,
            })
          }
        }
      })
  },
  add: function(){
    let me = this;
    let { loanAccounts } = me.data;
    console.log(loanAccounts)
    loanAccounts.push({
      name: '',
      receive_account: '',
      type: 0,
      loan_account: '',
      contract_pic: '',
      product_certificate_pic: '',
      loan_percent: 0,
      loan_person: this.data.loan_person
    })
    me.setData({
      loanAccounts: loanAccounts
    });
  },

  accountChange:function(e){
    let info = e.currentTarget.id.split('-');
    let name = info[0];
    let index = info[1];
    let loanAccounts = this.data.loanAccounts;
    let types = this.data.types;
    loanAccounts[index][name] = e.detail.value;
    this.setData({
      loanAccounts: loanAccounts,
    })
  },
  /**
   * 选择图片
   */
  chooseImg: function (e) {
    let info = e.currentTarget.id.split('-');
    let name = info[0];
    let index = info[1];
    let that = this;
    wx.chooseImage({
      count: 1,
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (e) {
        let loanAccounts = that.data.loanAccounts;
        wx.showToast({
          title: '数据加载中',
          icon: 'loading',
          duration: 2000
        });
        //上传
        that.loanAccountUpload(e.tempFilePaths[0],  function (res) {
          res = JSON.parse(res)
          console.log(res)
          loanAccounts[index][name] = config.fileBasePath + '/' + res.data.path;
          that.setData({
            loanAccounts: loanAccounts
          })
        })
      },
    })
  },
  //上传
  loanAccountUpload: function (filePath, cb) {
    let that = this;
    //上传
    let formData = {
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
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    const params = this.data.loanAccounts
    console.log(params)
    this.checkForm(params)
    if (this.data.errorList.length>0) {
      const error = this.data.errorList[0]
      wx.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    } else {

      if (this.data.hasData) {
        //更新
        //先删除
        util.removeByLoanPerson('loanAccount',this.data.loan_person)
          .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
              util.postMany('loanAccount', { docs: params })
                .then(data => {
                  wx.showToast({
                    title: data.meta.message,
                    icon: 'success',
                    duration: 1500,
                    success: function () {
                      wx.navigateTo({
                        url: '../reexamine/auth/index',
                      })
                    }
                  })
                })
                .catch(function (res) {
                  wx.showModal({
                    title: '友情提示',
                    content: '提交发生错误',
                    showCancel: false
                  })
                })
            }
          })
      } else {
        //新增
        util.postMany('loanAccount', {docs:params})
          .then(data => {
            wx.showToast({
              title: data.meta.message,
              icon: 'success',
              duration: 1500,
              success: function () {
                wx.navigateTo({
                  url: '../reexamine/auth/index',
                })
              }
            })
          })
          .catch(function (res) {
            wx.showModal({
              title: '友情提示',
              content: '提交发生错误',
              showCancel: false
            })
          })
      }
    }

  },
  /**
   * 验证
   */
  checkForm:function(params){
    let errorList = [];
    for (let param of params){
      if (param.receive_account==''){
        errorList.push({
          msg:'回款账号不能为空'
        })
      }
      if (param.loan_account == '') {
        errorList.push({
          msg: '放款账号不能为空'
        })
      }
      if (param.loan_percent == '') {
        errorList.push({
          msg: '放款比例不能为空'
        })
      }
      if (param.loan_percent < 0 || param.loan_percent>100) {
        errorList.push({
          msg: '请输入合适的放款比例'
        })
      }
      if (param.contract_pic == '') {
        errorList.push({
          msg: '请上传厂商签约合同'
        })
      }
      if (param.product_certificate_pic == '') {
        errorList.push({
          msg: '请上传产品授权书'
        })
      }
      if(errorList.length>0){
        break;
      }
    }
    this.setData({
      errorList: errorList
    })
  }
  
})