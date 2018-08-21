// pages/information/info.js

var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
    stock_percent:false,
    company_name:'',
    name:'',
    code:'',
    tel:'',
    address_detail:'',
    hasData: false,    
    loanPerson: {
      items: [],
      params: {
        page: 1,
        limit: 10,
      },
      paginate: {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const me = this;

    me.WxValidate = App.WxValidate({
      tel: {
        required: true,
        tel: true,
      },
      name: {
        required: true,
      },
      company_name:{
        required: true,
      },
      address_detail:{
        required:true
      }
    }, {
        tel: {
          required: '请输入11位手机号码',
          tel:'请输入正确的手机号码'
        },
        name: {
          required: '请输入名字',
        },
        company_name:{
          required: '请输入公司名字'
        },
        address_detail:{
          required: '请输入详细地址'
        }
      })

    me.loanPerson = App.HttpResource('/loanPerson/:id', { id: '@id' })
    me.initData();
  },
  initData:function(){
    let loanPerson = this.data.loanPerson;
    let params = loanPerson.params
    let me = this;
    this.setData({
      userId: wx.getStorageSync('userId')
    })
    params.userId = this.data.userId
    this.loanPerson.queryAsync(params)
      .then(data => {
        console.log(data)
        if (data.meta.code == 0) {
          loanPerson.items = [...loanPerson.items, ...data.data.items]
          loanPerson.paginate = data.data.paginate
          loanPerson.params.page = data.data.paginate.next
          loanPerson.params.limit = data.data.paginate.perPage
          if(loanPerson.items.length>0){
            let loanPersonFs = loanPerson.items[0];
            me.setData({
              loanPerson: loanPerson,
              region: [loanPersonFs.address_province, loanPersonFs.address_city, loanPersonFs.address_district],
              stock_percent: loanPersonFs.stock_percent,
              company_name: loanPersonFs.company_name,
              name: loanPersonFs.name,
              tel: loanPersonFs.tel ? loanPersonFs.tel : "",
              address_detail: loanPersonFs.address_detail,
              hasData: true,
              _id:loanPersonFs._id
            })
            wx.setStorageSync('loanPersonId', loanPersonFs._id)
          }
        }
      })
  },
  /**
   * switch是否占股40%
   */
  switchStock: function(e){
    this.setData({
      stockPercent:e.detail.value==='checked' ? 1 : 0
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
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
      
      if (this.data.hasData){
        //更新
        this.loanPerson.updateAsync({ id: this.data._id }, params)
          .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
              wx.showToast({
                title: data.meta.message,
                icon: 'success',
                duration: 1500,
                success: function () {
                  wx.redirectTo({
                    url: '../information/company/info',
                  })
                }
              })
            }
          })
      }else{
        //新增
        params.create_user = this.data.userId
        this.loanPerson.saveAsync(params)
          .then(data => {
            console.log(data)
            if (data.meta.code == 0) {
              wx.setStorageSync('loanPersonId', data.data._id)
              wx.showToast({
                title: data.meta.message,
                icon: 'success',
                duration: 1500, 
                success:function(){
                  wx.redirectTo({
                    url: '../information/company/info',
                  })
                }
              })
            }
          })

      }
    }
    
  },
})