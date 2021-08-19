import lottie from 'lottie-miniprogram'
import {Animation, TweenFunctions} from './utitlies/animation'
import {LottieLoadings} from './utitlies/lottie-loadings'


export class RefresherType {
  constructor({type, height, data}) {
    this.type = type
    this.height = height
    this.data = data
  }
}


Component({
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {

    enableLeadingRefresh: {
      type: Boolean,
      value: true
    },

    leadingRefresherType: {
      type: RefresherType,
      value: new RefresherType({
        type: 'lottie-loading',
        height: 50,
        data: LottieLoadings.heart()
      })
    },

    enableTrailingRefresh: {
      type: Boolean,
      value: true
    },

    trailingRefresherType: {
      type: RefresherType,
      value: new RefresherType({
        // type: 'lottie-loading',
        type: 'sentinel-loading',
        // height: 50,
        // data: LottieLoadings.circle()
      })
    },

    leadingPullingThreshold: {
      type: Number,
      value: 50
    },

    trailingPullingThreshold: {
      type: Number,
      value: 200
    },

    minimumRefreshDuration: {
      type: Number,
      value: 1200
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    containerRect: null,
    contentRect: null,
    leadingPullingOffset: 0,
    trailingPullingOffset: 0,

    leadingPullingPercentage: 0,
    trailingPullingPercentage: 0,
    scrollTop: 0,

  },

  lifetimes: {
    attached() {
      this.leadingRefresherState = {value: 'idle'}
      this.trailingRefresherState = {value: 'idle'}

      this.setupLottieRefreshers()
      this.setupSentinelLoadingHandle()
      this.setupAbortHandle()
      this.setupPullingHandle()
      this.setupRefreshingHandle()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initialize() {
      this.updateScrollViewOffsets()
    },
    updateScrollViewOffsets() {
      this.updateBoundingRect()
        .then(res => {
          if (this.leadingScrollViewOffset === undefined) {
            this.leadingScrollViewOffset = 0
          }
          this.trailingScrollViewOffset = res.contentRect.height -
            res.containerRect.height - this.leadingScrollViewOffset
        })
        .catch()
    },
    updateBoundingRect() {
      return new Promise(resolve => {
        wx.createSelectorQuery()
          .in(this)
          .select('#container')
          .boundingClientRect((res) => {
            this.containerRect = {
              left: res.left, top: res.top, width: res.width, height: res.height
            }
            wx.createSelectorQuery()
              .in(this)
              .select('#container-view')
              .boundingClientRect(res => {
                this.contentRect = {
                  left: res.left, top: res.top, width: res.width, height: res.height
                }
                resolve({containerRect: this.containerRect, contentRect: this.contentRect})
              })
              .exec()
          })
          .exec()
      })
    },
    setupLottieRefreshers() {
      const result = []
      if (this.properties.leadingRefresherType.type === 'lottie-loading') {
        result.push(this._lottieLoading('leading-refresher-canvas', this.properties.leadingRefresherType.data)
          .then((lottie) => {
            this.lottieLeadingRefresher = lottie
          }))
      }
      if (this.properties.trailingRefresherType.type === 'lottie-loading') {
        result.push(this._lottieLoading('trailing-refresher-canvas', this.properties.trailingRefresherType.data)
          .then((lottie) => {
            this.lottieTrailingRefresher = lottie
          }))
      }
      return result
    },
    _lottieLoading(id, data) {
      return new Promise((resolve) => {
        wx.createSelectorQuery().in(this).select('#' + id).fields({node: true, rect: true})
          .exec((res) => {
            const canvas = res[0].node
            const context = canvas.getContext('2d')

            const dpr = wx.getSystemInfoSync().pixelRatio

            canvas.width = canvas._width * dpr
            canvas.height = canvas._height * dpr

            context.scale(dpr, dpr)
            lottie.setup(canvas)
            const ani = lottie.loadAnimation({
              autoplay: false,
              loop: true,
              path: data.path,
              rendererSettings: {
                context
              }
            })
            ani.setSpeed(data.speed)
            resolve(ani)
          })
      })
    },
    setupAbortHandle() {
      const initAbortHandle = (refresherType) => {
        if (refresherType.type === 'none' || refresherType.type === 'sentinel-loading') {
          return () => {}
        } else {
          return (
            {
              status,
              lottieLoadingAnimation,
              pullingOffset,
              action,
            }
          ) => {
            if (status.value === 'refreshing') {
              status.value = 'idle'
              this._pullingBackAnimation({from: pullingOffset, to: 0, action})
              if (refresherType.type === 'lottie-loading') {
                lottieLoadingAnimation.goToAndStop(0, true)
              }
            }
          }
        }
      }
      const handleLeadingAbort = initAbortHandle(this.properties.leadingRefresherType)
      const handleTrailingAbort = initAbortHandle(this.properties.trailingRefresherType)

      this.handleAbort = () => {
        handleLeadingAbort({
          status: this.leadingRefresherState,
          lottieLoadingAnimation: this.lottieLeadingRefresher,
          pullingOffset: this.data.leadingPullingOffset,
          action: (res) => this.setData({leadingPullingOffset: res})
        })

        handleTrailingAbort({
          status: this.trailingRefresherState,
          lottieLoadingAnimation: this.lottieTrailingRefresher,
          pullingOffset: this.data.trailingPullingOffset,
          action: (res) => this.setData({trailingPullingOffset: res})
        })
      }
    },
    setupSentinelLoadingHandle() {
      const initSentinelLoadingHandle = (refresherType) => {
        if (refresherType.type === 'sentinel-loading') {
          return (
            {
              status,
              canRefresh,
              scrollViewOffset,
              pullingThreshold,
              onRefreshingEvent
            }
          ) => {
            if (scrollViewOffset > 0 &&
              scrollViewOffset < pullingThreshold &&
              canRefresh) {
              if (this._sentinelLoading) { return }
              status.value = 'refreshing'
              this._sentinelLoading = true
              this.triggerEvent(onRefreshingEvent, {
                instance: this,
                success: (outerCompletion) => {
                  if (status.value === 'refreshing') {
                    if (outerCompletion) outerCompletion()
                    status.value = 'idle'
                    this.updateScrollViewOffsets()
                    setTimeout(() => {
                      this._sentinelLoading = false
                    }, 500)
                  }
                },
                fail: () => {
                  // maybe you can add some error handling
                  status.value = 'idle'
                  setTimeout(() => {
                    this.updateScrollViewOffsets()
                    this._sentinelLoading = false
                  }, 500)
                }
              })
            } else {
              this.value = 'idle'
              this.updateScrollViewOffsets()
            }
          }
        } else {
          return () => {}
        }
      }
      const leadingSentinelLoadingHandle = initSentinelLoadingHandle(
        this.properties.leadingRefresherType
      )
      const trailingSentinelLoadingHandle = initSentinelLoadingHandle(
        this.properties.trailingRefresherType
      )
      this.sentinelLoadingHandle = () => {
        leadingSentinelLoadingHandle({
          status: this.leadingRefresherState,
          canRefresh: this.properties.enableLeadingRefresh,
          scrollViewOffset: this.leadingScrollViewOffset,
          pullingThreshold: this.properties.leadingPullingThreshold,
          onRefreshingEvent: 'onLeadingRefreshing'
        })

        trailingSentinelLoadingHandle({
          status: this.trailingRefresherState,
          canRefresh: this.properties.enableTrailingRefresh,
          scrollViewOffset: this.trailingScrollViewOffset,
          pullingThreshold: this.properties.trailingPullingThreshold,
          onRefreshingEvent: 'onTrailingRefreshing'
        })
      }
    },
    setupPullingHandle() {
      const initPullingEventAction = (
        {
          delta,
          statues,
          refresherType,
          scrollViewOffset,
          pullingOffset,
          pullingThreshold,
          lottieRefresherAnimation,
          onPullingEvent,
          action,
        }
      ) => {
        if (refresherType.type !== 'sentinel-loading' && statues.value === 'refreshing') return
        if (scrollViewOffset < 1) {
          if (refresherType.type === 'sentinel-loading') {
            statues.value = 'refreshing'
          } else {
            statues.value = 'pulling'
          }
          const newPullingOffset = pullingOffset + (Math.pow(delta - 1, 3) + 1) * 20
          if (newPullingOffset <= 0) {
            action(0, 0)
            return
          }
          const newPullingPercentage = Math.min(newPullingOffset, pullingThreshold) /
            pullingThreshold
          this.triggerEvent(onPullingEvent, {
            instance: this,
            offset: newPullingOffset,
            percentage: newPullingPercentage
          })

          if (refresherType.type === 'lottie-loading') {
            lottieRefresherAnimation.goToAndStop(
              newPullingPercentage * lottieRefresherAnimation.totalFrames * 0.75, true
            )
          }
          action(newPullingOffset, newPullingPercentage)
        }
      }
      this.pullingHandle = (e) => {
        const delta = Math.min(e.touches[0].pageY - this.lastTouch.pageY, 100) / 100

        initPullingEventAction({
          delta,
          statues: this.leadingRefresherState,
          refresherType: this.properties.leadingRefresherType,
          scrollViewOffset: this.leadingScrollViewOffset,
          pullingOffset: this.data.leadingPullingOffset,
          pullingThreshold: this.properties.leadingPullingThreshold,
          lottieRefresherAnimation: this.lottieLeadingRefresher,
          onPullingEvent: 'onLeadingPulling',
          action: (offset, percentage) => {
            this.setData({
              leadingPullingOffset: offset,
              leadingPullingPercentage: percentage
            })
          }
        })

        initPullingEventAction({
          delta: -delta,
          statues: this.trailingRefresherState,
          refresherType: this.properties.trailingRefresherType,
          scrollViewOffset: this.trailingScrollViewOffset,
          pullingOffset: this.data.trailingPullingOffset,
          pullingThreshold: this.properties.trailingPullingThreshold,
          lottieRefresherAnimation: this.lottieTrailingRefresher,
          onPullingEvent: 'onTrailingPulling',
          action: (offset, percentage) => {
            this.setData({
              trailingPullingOffset: offset,
              trailingPullingPercentage: percentage
            })
          }
        })
      }
    },
    setupRefreshingHandle() {
      const initialRefreshingAction = (refresherType) => {
        switch (refresherType.type) {
          case 'lottie-loading':
            return (
              {
                status,
                canRefresh,
                lottieRefresherAnimation,
                refresherHeight,
                pullingOffset,
                pullingThreshold,
                onRefreshingEvent,
                action,
              }
            ) => {
              if (status.value !== 'pulling') return
              let endPullingOffset = 0
              if (pullingOffset > pullingThreshold && canRefresh) {
                status.value = 'refreshing'
                endPullingOffset = refresherHeight

                lottieRefresherAnimation.play()
                const triggerTime = new Date().getTime()
                this.triggerEvent(onRefreshingEvent, {
                  instance: this,
                  success: (outerCompletion) => {
                    if (status.value === 'refreshing') {
                      const now = new Date().getTime()
                      const delta = now - triggerTime
                      console.log(delta)
                      setTimeout(() => {
                        this._pullingBackAnimation({
                          from: pullingOffset,
                          to: 0,
                          action,
                          completion: () => {
                            status.value = 'idle'
                            lottieRefresherAnimation.goToAndStop(0, true)
                            this.updateScrollViewOffsets()
                            if (outerCompletion) {
                              outerCompletion()
                            }
                          }
                        })
                      }, Math.max(this.properties.minimumRefreshDuration - delta, 0))
                    }
                  },
                  fail: () => {
                    // maybe you can add some error handling
                  }
                })
              } else {
                lottieRefresherAnimation.goToAndStop(0, true)
                status.value = 'idle'
              }
              this._pullingBackAnimation({
                from: pullingOffset,
                to: endPullingOffset,
                action
              })
            }
          case 'custom-loading':
            return (
              {
                status,
                canRefresh,
                refresherHeight,
                pullingOffset,
                pullingThreshold,
                onRefreshingEvent,
                action,
              }
            ) => {
              if (status.value !== 'pulling') return
              let endPullingOffset = 0
              if (pullingOffset > pullingThreshold && canRefresh) {
                status.value = 'refreshing'
                endPullingOffset = refresherHeight
                const triggerTime = new Date().getTime()
                this.triggerEvent(onRefreshingEvent, {
                  instance: this,
                  success: (outerCompletion) => {
                    if (status.value === 'refreshing') {
                      const now = new Date().getTime()
                      const delta = now - triggerTime
                      setTimeout(() => {
                        this._pullingBackAnimation({
                          from: pullingOffset,
                          to: 0,
                          action,
                          completion: () => {
                            status.value = 'idle'
                            this.updateScrollViewOffsets()
                            if (outerCompletion) outerCompletion()
                          }
                        })
                      }, Math.max(this.properties.minimumRefreshDuration - delta, 0))
                    }
                  },
                  fail: () => {
                    // maybe you can add some error handling
                  }
                })
              } else {
                status.value = 'idle'
              }

              this._pullingBackAnimation({
                from: pullingOffset,
                to: endPullingOffset,
                action
              })
            }
          case 'sentinel-loading':
            return (
              {
                status,
                canRefresh,
                pullingOffset,
                action
              }
            ) => {
              if (canRefresh) {
                status.value = 'refreshing'
              }
              this._pullingBackAnimation({
                from: pullingOffset,
                to: 0,
                action
              })
            }
          default:
            return (
              {
                status,
                pullingOffset,
                action
              }
            ) => {
              status.value = 'idle'
              this._pullingBackAnimation({
                from: pullingOffset,
                to: 0,
                action
              })
            }
        }
      }

      const leadingRefreshingEventAction = initialRefreshingAction(
        this.properties.leadingRefresherType
      )
      const trailingRefreshingEventAction = initialRefreshingAction(
        this.properties.trailingRefresherType
      )

      this.refreshingHandle = () => {
        leadingRefreshingEventAction({
          status: this.leadingRefresherState,
          canRefresh: this.properties.enableLeadingRefresh,
          refresherHeight: this.properties.leadingRefresherType.height,
          lottieRefresherAnimation: this.lottieLeadingRefresher,
          pullingOffset: this.data.leadingPullingOffset,
          pullingThreshold: this.properties.leadingPullingThreshold,
          onRefreshingEvent: 'onLeadingRefreshing',
          action: (res) => {
            this.setData({leadingPullingOffset: res})
          }
        })

        trailingRefreshingEventAction({
          status: this.trailingRefresherState,
          canRefresh: this.properties.enableTrailingRefresh,
          refresherHeight: this.properties.trailingRefresherType.height,
          lottieRefresherAnimation: this.lottieTrailingRefresher,
          pullingOffset: this.data.trailingPullingOffset,
          pullingThreshold: this.properties.trailingPullingThreshold,
          onRefreshingEvent: 'onTrailingRefreshing',
          action: (res) => {
            this.setData({trailingPullingOffset: res})
          }
        })
      }
    },
    onScroll(e) {
      if (this.leadingRefresherState.value === 'pulling' || this.trailingRefresherState.value === 'pulling') return
      const {scrollTop} = e.detail
      this.leadingScrollViewOffset = scrollTop
      this.trailingScrollViewOffset = this.contentRect.height -
        this.containerRect.height - this.leadingScrollViewOffset

      this.sentinelLoadingHandle()
    },
    onTouchStart(e) {
      this.lastTouch = e.touches[0]
      this.handleAbort()
    },
    onTouchMove(e) {
      this.pullingHandle(e)
      this.lastTouch = e.touches[0]
    },
    onTouchEnd() {
      this.refreshingHandle()
    },
    _pullingBackAnimation(
      {
        from,
        to,
        action,
        completion,
      }
    ) {
      const anim = new Animation(from, to, 300, TweenFunctions.easeOutQuad)
      anim.fire(action, completion)
    }
  }
})
