
Page({
  data: {
    arr: [],
    canLoadMore: true,
    triggered: false,
    containerRect: null,
  },

  getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rgb.push(color)
    }
    return rgb.join('') + 'ff'
  },

  onReady() {
    wx.request({
      url: 'https://random-data-api.com/api/users/random_user?size=20',
      success: result => {
        console.log(result)
        const arr = result.data.map(res => { res.color = this.getRandomColor(); return res })
        this.setData({
          arr
        })
      }
    })
  },

  onPulling(e) {
    console.log('onPulling:', e)
  },

  onRefresh(e) {
    wx.request({
      url: 'https://random-data-api.com/api/users/random_user?size=20',
      success: result => {
        const arr = result.data.map(res => { res.color = this.getRandomColor(); return res })
        e.detail.success(this.setData({
          arr
        }))
      }
    })
  },

  loadMore(e) {
    wx.request({
      url: 'https://random-data-api.com/api/users/random_user?size=20',
      success: result => {
        const arr = result.data.map(res => { res.color = this.getRandomColor(); return res })
        e.detail.success(() => {
          console.log('completion2')
          this.setData({
            arr: this.data.arr.concat(arr)
          })
        })
      }
    })
  },

  onRestore(e) {
    console.log('onRestore:', e)
  },

  onAbort(e) {
    console.log('onAbort', e)
  },
})
