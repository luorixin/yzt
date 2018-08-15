// pages/information/company/info.js
import { Promise } from '../../../utils/util.js'

var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市','北京市','东城区'],
    products: [{
      name: '',
      percent: ''
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.WxValidate = App.WxValidate({
      sellAmount: {
        required: true,
        number: true,
      },
      sellCompanyName1: {
        required: true,
      },
      sellDueDate1:{
        required:true,
        number:true
      },
      sellCompanyName2: {
        required: true,
      },
      sellDueDate2: {
        required: true,
        number: true
      },
      sellCompanyName3: {
        required: true,
      },
      sellDueDate3: {
        required: true,
        number: true
      },
      addressDetail: {
        required: true
      }
    }, {
        sellAmount: {
          required: '请输入销售额',
        },
        companyName: {
          required: '请输入公司名字'
        },
        sellCompanyName1: {
          required: "请输入企业全称",
        },
        sellDueDate1: {
          required: "请输入账期",
          number: "请输入数字"
        },
        sellCompanyName2: {
          required: "请输入企业全称",
        },
        sellDueDate2: {
          required: "请输入账期",
          number: "请输入数字"
        },
        sellCompanyName3: {
          required: "请输入企业全称",
        },
        sellDueDate3: {
          required: "请输入账期",
          number: "请输入数字"
        },
        addressDetail: {
          required: '请输入详细地址'
        }
      })
  },

  
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindProductAdd: function(e){
    let me = this;
    let {products} = me.data;
    products.push({
      name:'',
      percent:''
    })
    me.setData({
      products: products
    });
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    if (this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    } else {
      wx.redirectTo({
        url: '../../uploadPic/idCard',
      })
    }

  },
})