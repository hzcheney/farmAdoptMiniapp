// pages/user/user.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  getUserInfo(e) {
    let _data = {};
    _data.userInfo = e.detail.userInfo;
    this.setData(_data);

    console.log(this.data);
  },
  getUserId: function (cb) {
    let that = this;
    var value = this.data.userId || wx.getStorageSync("userId");
    console.log(value);
    if (value) {
      if (cb) {
        cb(value);
      }
      return value;
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (userData) {
              wx.setStorageSync("userId", userData.signature);
              that.setData({
                userId: userData.signature,
              });
              db.collection("user")
                .where({
                  userId: userData.signature,
                })
                .get()
                .then((searchResult) => {
                  if (searchResult.data.length === 0) {
                    wx.showToast({
                      title: "新用户录入中",
                    });
                    db.collection("user")
                      .add({
                        data: {
                          userId: userData.signature,
                          date: db.serverDate(),
                          name: userData.userInfo.nickName,
                          gender: userData.userInfo.gender,
                          userAppoint: [],
                          userRent: [],
                          userOrder: {
                            prePayment: [],
                            preDelivery: [],
                            preReceipt: [],
                          },
                          userLevel: 0,
                          userCash: 0,
                          userScore: 0,
                          userCoupon: [],
                          userAddr: [],
                        },
                      })
                      .then((res) => {
                        console.log(res);
                        if (res.errMsg === "collection.add:ok") {
                          wx.showToast({
                            title: "录入完成",
                          });
                          if (cb) cb();
                        }
                      })
                      .catch((err) => {
                        wx.showToast({
                          title: "录入失败，请稍后重试",
                          image: "/images/error.png",
                        });
                        wx.navigateTo({
                          url: "/pages/index/index",
                        });
                      });
                  } else {
                    if (cb) cb();
                  }
                });
            },
          });
        } else {
          wx.showToast({
            title: "登陆失效，请重新授权登陆",
            image: "/images/error.png",
          });
          wx.navigateTo({
            url: "/pages/index/index",
          });
        }
      },
    });
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
