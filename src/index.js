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
        type: 'lottie-loading',
        height: 50,
        data: LottieLoadings.circle()
      })
    },

    leadingPullingThreshold: {
      type: Number,
      value: 50
    },

    trailingPullingThreshold: {
      type: Number,
      value: 50
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
      this.setupLeadingRefresher()
      this.setupAbortHandle()
      this.setupSentinelLoadingHandle()
      this.setupPullingHandle()
      this.setupRefreshingHandle()
      this.setupScrollViewRectUpdatingHandle()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    updateScrollViewOffsets() {
      this.updateBoundingRect()
        .then(res => {
          // console.log(res)
          if (this.leadingScrollViewOffset === undefined) {
            this.leadingScrollViewOffset = 0
          }
          this.trailingScrollViewOffset = res.contentRect.height -
            res.containerRect.height - this.leadingScrollViewOffset
          // console.log(this.leadingScrollViewOffset)
          // console.log(this.trailingScrollViewOffset)
        })
        .catch()
    },
    initialRefreshing() {
      this.leadingRefresherState.value = 'pulling'
      this.setData({
        leadingPullingOffset: this.data.leadingPullingThreshold + 1
      })
      this.refreshingHandle()
    },
    updateBoundingRect() {
      return new Promise(resolve => {
        wx.createSelectorQuery()
          .in(this)
          .select('#container')
          .boundingClientRect((res) => {
            console.log(res)
            this.containerRect = {
              left: res.left, top: res.top, width: res.width, height: res.height
            }
            wx.createSelectorQuery()
              .in(this)
              .select('#container-view')
              .boundingClientRect(res => {
                const info = wx.getSystemInfoSync()
                console.log(info.platform)
                this.contentRect = {
                  left: res.left, top: res.top - 8, width: res.width, height: res.height + (info.platform === 'ios' ? 8 : 16)
                }
                resolve({containerRect: this.containerRect, contentRect: this.contentRect})
              })
              .exec()
          })
          .exec()
      })
    },
    setupScrollViewRectUpdatingHandle() {
      this.leadingRefreshScrollViewRectUpdatingHandle = () => {
        this.updateScrollViewOffsets()
        // wx.createSelectorQuery().in(this).select('#container-view').boundingClientRect((res) => {
        //   this.leadingScrollViewOffset = 0
        //   this.trailingScrollViewOffset = res.height - this.containerRect.height
        //   this.contentRect = {
        //     left: res.left, top: res.top, width: res.width, height: res.height
        //   }
        // })
        //   .exec()
      }
      this.trailingRefreshScrollViewRectUpdatingHandle = () => {
        this.updateScrollViewOffsets()
        // wx.createSelectorQuery().in(this).select('#container-view').boundingClientRect((res) => {
        //   this.trailingScrollViewOffset = res.height -
        //     this.leadingScrollViewOffset - this.containerRect.height
        //   this.contentRect = {
        //     left: res.left, top: res.top, width: res.width, height: res.height
        //   }
        // })
        //   .exec()
      }
    },
    setupLeadingRefresher() {
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
              onRefreshingEvent,
              innerCompletion,
            }
          ) => {
            if (scrollViewOffset > 0 && scrollViewOffset < pullingThreshold && canRefresh) {
              status.value = 'refreshing'

              this.triggerEvent(onRefreshingEvent, {
                instance: this,
                success: (outerCompletion) => {
                  if (status.value === 'refreshing') {
                    status.value = 'idle'
                    if (outerCompletion) outerCompletion()
                    innerCompletion()
                  }
                },
                fail: () => {
                  // maybe you can add some error handling
                  status.value = 'idle'
                }
              })
            } else {
              status.value = 'idle'
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
          onRefreshingEvent: 'onLeadingRefreshing',
          innerCompletion: () => {
            this.leadingRefreshScrollViewRectUpdatingHandle()
          }
        })

        trailingSentinelLoadingHandle({
          status: this.trailingRefresherState,
          canRefresh: this.properties.enableTrailingRefresh,
          scrollViewOffset: this.trailingScrollViewOffset,
          pullingThreshold: this.properties.trailingPullingThreshold,
          onRefreshingEvent: 'onTrailingRefreshing',
          innerCompletion: () => {
            this.trailingRefreshScrollViewRectUpdatingHandle()
          }
        })
      }
    },
    setupPullingHandle() {
      // console.log(this.properties.leadingRefresherType)
      // console.log(this.properties.trailingRefresherType)
      const leadingPullingEventAction = this.initPullingEventAction(
        this.properties.leadingRefresherType
      )
      const trailingPullingEventAction = this.initPullingEventAction(
        this.properties.trailingRefresherType
      )

      this.pullingHandle = (e) => {
        const delta = Math.min(e.touches[0].pageY - this.lastTouch.pageY, 100) / 100

        leadingPullingEventAction({
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

        trailingPullingEventAction({
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
    initPullingEventAction() {
      return (
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
        if (statues.value === 'refreshing') return
        if (scrollViewOffset < 1) {
          statues.value = 'pulling'
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
                innerCompletion,
                endPullingOffset,

              }
            ) => {
              if (pullingOffset > pullingThreshold) {
                status.value = 'refreshing'
                endPullingOffset.value = refresherHeight

                lottieRefresherAnimation.play()

                this.triggerEvent(onRefreshingEvent, {
                  instance: this,
                  success: (outerCompletion) => {
                    if (status.value === 'refreshing' && canRefresh) {
                      this._pullingBackAnimation({
                        from: pullingOffset,
                        to: 0,
                        action,
                        completion: () => {
                          innerCompletion()
                          if (outerCompletion) {
                            outerCompletion()
                          }
                          lottieRefresherAnimation.goToAndStop(0, true)
                          status.value = 'idle'
                        }
                      })
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
                innerCompletion,
                endPullingOffset,
              }
            ) => {
              if (pullingOffset > pullingThreshold && canRefresh) {
                status.value = 'refreshing'
                endPullingOffset.value = refresherHeight
                this.triggerEvent(onRefreshingEvent, {
                  instance: this,
                  success: (outerCompletion) => {
                    if (status.value === 'refreshing') {
                      this._pullingBackAnimation({
                        from: pullingOffset,
                        to: 0,
                        action,
                        completion: () => {
                          status.value = 'idle'
                          if (outerCompletion) outerCompletion()
                          innerCompletion()
                        }
                      })
                    }
                  },
                  fail: () => {
                    // maybe you can add some error handling
                  }
                })
              } else {
                status.value = 'idle'
              }
            }
          default:
            return ({status}) => {
              // console.log('none')
              status.value = 'idle'
            }
        }
      }

      const leadingRefreshingEventAction = initialRefreshingAction(
        this.properties.leadingRefresherType
      ).bind(this)
      const trailingRefreshingEventAction = initialRefreshingAction(
        this.properties.trailingRefresherType
      ).bind(this)

      this.refreshingHandle = () => {
        this._handleRefreshing({
          status: this.leadingRefresherState,
          canRefresh: this.properties.enableLeadingRefresh,
          refresherHeight: this.properties.leadingRefresherType.height,
          lottieRefresherAnimation: this.lottieLeadingRefresher,
          pullingOffset: this.data.leadingPullingOffset,
          pullingThreshold: this.properties.leadingPullingThreshold,
          onRefreshingEvent: 'onLeadingRefreshing',
          onRefreshingEventAction: leadingRefreshingEventAction,
          action: (res) => {
            this.setData({leadingPullingOffset: res})
          },
          innerCompletion: () => {
            this.leadingRefreshScrollViewRectUpdatingHandle()
          }
        })

        this._handleRefreshing({
          status: this.trailingRefresherState,
          canRefresh: this.properties.enableTrailingRefresh,
          refresherHeight: this.properties.trailingRefresherType.height,
          lottieRefresherAnimation: this.lottieTrailingRefresher,
          pullingOffset: this.data.trailingPullingOffset,
          pullingThreshold: this.properties.trailingPullingThreshold,
          onRefreshingEvent: 'onTrailingRefreshing',
          onRefreshingEventAction: trailingRefreshingEventAction,
          action: (res) => {
            this.setData({trailingPullingOffset: res})
          },
          innerCompletion: () => {
            this.trailingRefreshScrollViewRectUpdatingHandle()
          }
        })
      }
    },
    _handleRefreshing(
      {
        status,
        canRefresh,
        refresherHeight,
        lottieRefresherAnimation,
        pullingOffset,
        pullingThreshold,
        onRefreshingEvent,
        onRefreshingEventAction,
        action,
        innerCompletion,
      }
    ) {
      if (status.value !== 'pulling') return
      const endPullingOffset = {}
      endPullingOffset.value = 0
      onRefreshingEventAction({
        status,
        canRefresh,
        lottieRefresherAnimation,
        refresherHeight,
        pullingOffset,
        pullingThreshold,
        onRefreshingEvent,
        action,
        innerCompletion,
        endPullingOffset
      })
      this._pullingBackAnimation({
        from: pullingOffset,
        to: endPullingOffset.value,
        action
      })
    },
    onScroll(e) {
      console.log('==========')
      console.log(this.leadingRefresherState)
      console.log(this.trailingRefresherState)
      if (this.leadingRefresherState.value === 'pulling' || this.trailingRefresherState.value === 'pulling') return
      const {scrollTop} = e.detail
      console.log('--------------------------')
      console.log(e.detail)
      console.log(this.contentRect)
      console.log(this.leadingScrollViewOffset)
      console.log(this.trailingScrollViewOffset)
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
