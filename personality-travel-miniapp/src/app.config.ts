export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/quiz/index',
    'pages/result/index',
    'pages/mine/index',
    'pages/about/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '人格旅行',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f6f5f1'
  },
  tabBar: {
    color: '#9aa09b',
    selectedColor: '#6f9288',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tabbar/home.svg',
        selectedIconPath: 'assets/tabbar/home-selected.svg'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: 'assets/tabbar/mine.svg',
        selectedIconPath: 'assets/tabbar/mine-selected.svg'
      }
    ]
  }
})
