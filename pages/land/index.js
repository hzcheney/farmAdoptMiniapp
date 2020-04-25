// pages/land/land.js
import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    landDetail: [],
    active: 0,
    status: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (this.data.landDetail) {
      that.loadData();
    } else {
      console.log("no action");
    }
  },
  loadData() {
    var that = this;
    let landDetail = [];
    let status = [];
    wx.showLoading({
      title: "加载中",
    });
    db.collection("land")
      .where({
        category: this.data.active,
      })
      .get({
        success: function (res) {
          wx.hideLoading();
          // res.data 是包含以上定义的两条记录的数组
          console.log(res.data);
          for (let index = 0; index < res.data.length; index++) {
            let element = res.data[index];
            if (!element.status) {
              let item = "关闭中";
              status.push(item);
            } else {
              let item = "开放中";
              status.push(item);
            }
            that.setData({
              status: status,
            });
            landDetail.push(element);
          }

          that.setData({
            landDetail: landDetail,
          });
        },
        error: console.error,
      });
  },
  appointment(e) {
    var that = this;

    console.log(e.currentTarget.dataset.landdetail);
    let id = e.currentTarget.dataset.landdetail._id;
    Toast.success("预约成功");
    db.collection("land")
      .doc(id)
      .update({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          isAppointed: true,
        },
        success: function (res) {
          console.log(res.data);
          that.loadData();
        },
      });
  },
  onClick(event) {
    var that = this;
    this.setData({
      active: event.detail.name,
    });
    console.log(event.detail.name);
    if (this.data.landDetail) {
      that.loadData();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
