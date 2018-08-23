// pages/information/company/info.js
import { Promise } from '../../../utils/util.js'

var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市','北京市','东城区'],
    loan_person:'',
    name: '',
    spot_amount:'',
    sell_amount:'',
    products: [{
      name: '',
      percent: ''
    }],
    sales_customer:[{
      name:'',
      dueDate:''
    }, {
      name: '',
      dueDate: ''
    }, {
      name: '',
      dueDate: ''
    }],
    address_detail: '',
    loanCompany: {
      items: [],
      params: {
        page: 1,
        limit: 10,
      },
      paginate: {}
    },
    hasData:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.WxValidate = App.WxValidate({
      spot_amount: {
        required: true,
        number: true,
      },
      name: {
        required: true,
      },
      sell_amount:{
        required:true,
        number:true
      },
      address_detail: {
        required: true
      }
    }, {
        spot_amount: {
          required: '请输入垫付金额',
        },
        sell_amount: {
          required: '请输入销售额',
        },
        name: {
          required: '请输入公司名字'
        },
        address_detail: {
          required: '请输入详细地址'
        }
      })
    
    this.loanCompany = App.HttpResource('/loanCompany/:id', { id: '@id' })
    this.initData();

  },

  initData: function(){
    let loanCompany = this.data.loanCompany;
    let params = loanCompany.params
    let me = this;
    this.setData({
      loan_person: wx.getStorageSync('loanPersonId')
    })
    params.loan_person = this.data.loan_person
    this.loanCompany.queryAsync(params)
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          loanCompany.items = [...loanCompany.items, ...data.data.items]
          loanCompany.paginate = data.data.paginate
          loanCompany.params.page = data.data.paginate.next
          loanCompany.params.limit = data.data.paginate.perPage
          if (loanCompany.items.length > 0) {
            let loanCompanyFs = loanCompany.items[0];
            let products = loanCompanyFs.product;
            me.setData({
              loanCompany: loanCompany,
              region: [loanCompanyFs.address_province, loanCompanyFs.address_city, loanCompanyFs.address_district],
              name: loanCompanyFs.name,
              products:loanCompanyFs.product,
              sales_customer: loanCompanyFs.sales_customer,
              spot_amount: loanCompanyFs.spot_amount ? loanCompanyFs.spot_amount : "",
              sell_amount: loanCompanyFs.sell_amount ? loanCompanyFs.sell_amount : "",
              address_detail: loanCompanyFs.address_detail,
              hasData: true,
              _id: loanCompanyFs._id
            })
            wx.setStorageSync('loanCompanyId', loanCompanyFs._id)
          }
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
    console.log(products)
    products.push({
      name:'',
      percent:''
    })
    me.setData({
      products: products
    });
  },
  customerChange: function(e){
    let info = e.currentTarget.id.split('_');
    let name = info[0];
    let index = info[1];
    let sales_customer = this.data.sales_customer;
    sales_customer[index][name] = e.detail.value;
    this.setData({
      sales_customer: sales_customer
    })
  },
  productChange: function(e){
    let info = e.currentTarget.id.split('_');
    let name = info[0];
    let index = info[1];
    let products = this.data.products;
    products[index][name] = e.detail.value;
    this.setData({
      products: products
    })
  },
  /**
   * 提交
   */
  formSubmit: function (e) {
    const params = e.detail.value
    params.address_province = this.data.region[0]
    params.address_city = this.data.region[1]
    params.address_district = this.data.region[2]
    params.sales_customer = this.data.sales_customer;
    params.product = this.data.products
    console.log(params)
    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      wx.showModal({
        title: '友情提示',
        content: `${error.msg}`,
        showCancel: !1,
      })
      return false
    } else {
      
      if (this.data.hasData) {
        //更新
        this.loanCompany.updateAsync({ id: this.data._id }, params)
          .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
              wx.showToast({
                title: data.meta.message,
                icon: 'success',
                duration: 1500,
                success: function () {
                  wx.navigateTo({
                    url: '../../uploadPic/idCard',
                  })
                }
              })
            }
          })
      } else {
        //新增
        params.loan_person = this.data.loan_person
        this.loanCompany.saveAsync(params)
          .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
              wx.setStorageSync('loanCompanyId', data.data._id)
              wx.showToast({
                title: data.meta.message,
                icon: 'success',
                duration: 1500,
                success: function () {
                  wx.navigateTo({
                    url: '../../uploadPic/idCard',
                  })
                }
              })
            }
          })

      }
    }

  },
})