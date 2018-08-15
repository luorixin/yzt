// pages/information/info.js
import { Promise } from '../../utils/util';

var App = getApp()

const API = 'https://restapi.amap.com/v3/config/district?key=0aa165b65eaabe38cc862bb13e50f8e0'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceData: [],
    cityData: [],
    districtData:[],
    region: [0, 0 , 0],
    stockPercent:0,
    companyName:'',
    name:'',
    code:'',
    phone:'',
    addressDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const me = this;
    Promise(wx.request, {
      url: API,
      method: 'GET'
    })
    .then(res => {
      if (+res.statusCode == 200) {
        let provinceList = res.data.districts[0].districts;
        me.setData({
          provinceData: provinceList,
        });

        let firstProvince = provinceList[0];
        return Promise(wx.request, {
          url: API + '&keywords=' + firstProvince.name,
          method: 'GET'
        })
      }
      else {
        me.setData({ provinceData: [] });
      }
    })
    .catch(err => {
      console.log(err)
      me.setData({ provinceData: [] });
    })
    .then(res => {
      if (+res.statusCode == 200) {
        let cityData = res.data.districts[0].districts;
        me.setData({
          cityData: cityData,
        });
        let firstCity = cityData[0];
        return Promise(wx.request, {
          url: API + '&keywords=' + firstCity.name,
          method: 'GET'
        })
      }
      else {
        me.setData({ cityData: [] });
      }
    })
    .catch(err => {
      console.log(err)
      me.setData({
        cityData: []
      });
    })
    .then(res => {
      if (+res.statusCode == 200) {
        let districtData = res.data.districts[0].districts;
        me.setData({
          districtData: districtData,
        });
      }
      else {
        me.setData({ districtData: [] });
      }
    })
    .catch(err => {
      console.log(err)
      me.setData({
        districtData: []
      });
    })

    me.WxValidate = App.WxValidate({
      phone: {
        required: true,
        tel: true,
      },
      name: {
        required: true,
      },
      companyName:{
        required: true,
      },
      addressDetail:{
        required:true
      }
    }, {
        phone: {
          required: '请输入11位手机号码',
          tel:'请输入正确的手机号码'
        },
        name: {
          required: '请输入名字',
        },
        companyName:{
          required: '请输入公司名字'
        },
        addressDetail:{
          required: '请输入详细地址'
        }
      })
  },
  /**
   * switch是否占股40%
   */
  switchStock: function(e){

  },
  bindProvinceChange: function (e) {
    let me = this;
    let val = e.detail.value;
    let provinceIndex = val[0];
    let { provinceData ,region} = me.data;

    Promise(wx.request, {
      url: API + '&keywords=' + provinceData[provinceIndex].name,
      method: 'GET'
    })
    .then(res => {
      if (+res.statusCode === 200) {
        region[0] = provinceIndex
        region[1] = 0
        region[2] = 0
        me.setData({
          cityData: res.data.districts[0].districts,
          region : region
        });
        let firstCity = res.data.districts[0].districts[0];
        return Promise(wx.request, {
          url: API + '&keywords=' + firstCity.name,
          method: 'GET'
        })
      }
      else {
        me.setData({
          cityData: []
        });
      }
    })
    .catch(err => {
      me.setData({
        cityData: []
      });
    })
    .then(res => {
      if (+res.statusCode == 200) {
        let districtData = res.data.districts[0].districts;
        me.setData({
          districtData: districtData,
        });
      }
      else {
        me.setData({ districtData: [] });
      }
    })
    .catch(err => {
      me.setData({
        districtData: []
      });
    });
  },
  bindCityChange: function (e) {
    let me = this;
    let val = e.detail.value;
    let cityIndex = val[0];
    let { cityData, region } = me.data;

    Promise(wx.request, {
      url: API + '&keywords=' + cityData[cityIndex].name,
      method: 'GET'
    })
      .then(res => {
        if (+res.statusCode === 200) {
          region[1] = cityIndex
          region[2] = 0
          me.setData({
            districtData: res.data.districts[0].districts,
            region: region
          });
        }
        else {
          me.setData({
            districtData: []
          });
        }
      })
      .catch(err => {
        me.setData({
          districtData: []
        });
      });
  },
  bindDistChange:function(e){
    let me = this;
    let val = e.detail.value;
    let cityIndex = val[0];
    let { region } = me.data;
    region[2] = cityIndex
    me.setData({
      region: region
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
        url: '../information/company/info',
      })
    }
    
  },
})