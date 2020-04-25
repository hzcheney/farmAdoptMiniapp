Component({
  data: {
    active: 0,
    list: [
      {
        icon: "home-o",
        text: "首页",
        url: "/pages/index/index",
      },
      {
        icon: "apps-o",
        text: "租地",
        url: "/pages/land/index",
      },
      {
        icon: "orders-o",
        text: "认养",
        url: "/pages/adopt/index",
      },
      {
        icon: "user-o",
        text: "我的",
        url: "/pages/user/index",
      },
    ],
  },

  methods: {
    onChange(event) {
      this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[event.detail].url,
      });
    },

    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(
          (item) => item.url === `/${page.route}`
        ),
      });
    },
  },
});
