export const TweenFunctions = {
  linear(t, b, _c, d) {
    const c = _c - b
    return c * t / d + b
  },
  easeInQuad(t, b, _c, d) {
    const c = _c - b
    return c * (t /= d) * t + b
  },
  easeOutQuad(t, b, _c, d) {
    const c = _c - b
    return -c * (t /= d) * (t - 2) + b
  },
  easeInOutQuad(t, b, _c, d) {
    const c = _c - b
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b
    } else {
      return -c / 2 * ((--t) * (t - 2) - 1) + b
    }
  },
  easeInCubic(t, b, _c, d) {
    const c = _c - b
    return c * (t /= d) * t * t + b
  },
  easeOutCubic(t, b, _c, d) {
    const c = _c - b
    return c * ((t = t / d - 1) * t * t + 1) + b
  },
  easeInOutCubic(t, b, _c, d) {
    const c = _c - b
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t + b
    } else {
      return c / 2 * ((t -= 2) * t * t + 2) + b
    }
  },
  easeInQuart(t, b, _c, d) {
    const c = _c - b
    return c * (t /= d) * t * t * t + b
  },
  easeOutQuart(t, b, _c, d) {
    const c = _c - b
    return -c * ((t = t / d - 1) * t * t * t - 1) + b
  },
  easeInOutQuart(t, b, _c, d) {
    const c = _c - b
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t + b
    } else {
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    }
  },
  easeInQuint(t, b, _c, d) {
    const c = _c - b
    return c * (t /= d) * t * t * t * t + b
  },
  easeOutQuint(t, b, _c, d) {
    const c = _c - b
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b
  },
  easeInOutQuint(t, b, _c, d) {
    const c = _c - b
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t * t * t * t + b
    } else {
      return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    }
  },
  easeInSine(t, b, _c, d) {
    const c = _c - b
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
  },
  easeOutSine(t, b, _c, d) {
    const c = _c - b
    return c * Math.sin(t / d * (Math.PI / 2)) + b
  },
  easeInOutSine(t, b, _c, d) {
    const c = _c - b
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
  },
  easeInExpo(t, b, _c, d) {
    const c = _c - b
    return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
  },
  easeOutExpo(t, b, _c, d) {
    const c = _c - b
    return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
  },
  easeInOutExpo(t, b, _c, d) {
    const c = _c - b
    if (t === 0) {
      return b
    }
    if (t === d) {
      return b + c
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b
    } else {
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    }
  },
  easeInCirc(t, b, _c, d) {
    const c = _c - b
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
  },
  easeOutCirc(t, b, _c, d) {
    const c = _c - b
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
  },
  easeInOutCirc(t, b, _c, d) {
    const c = _c - b
    if ((t /= d / 2) < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
    } else {
      return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }
  },
  easeInElastic(t, b, _c, d) {
    const c = _c - b
    let a; let p; let
      s
    s = 1.70158
    p = 0
    a = c
    if (t === 0) {
      return b
    } else if ((t /= d) === 1) {
      return b + c
    }
    if (!p) {
      p = d * 0.3
    }
    if (a < Math.abs(c)) {
      a = c
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a)
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
  },
  easeOutElastic(t, b, _c, d) {
    const c = _c - b
    let a; let p; let
      s
    s = 1.70158
    p = 0
    a = c
    if (t === 0) {
      return b
    } else if ((t /= d) === 1) {
      return b + c
    }
    if (!p) {
      p = d * 0.3
    }
    if (a < Math.abs(c)) {
      a = c
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a)
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
  },
  easeInOutElastic(t, b, _c, d) {
    const c = _c - b
    let a; let p; let
      s
    s = 1.70158
    p = 0
    a = c
    if (t === 0) {
      return b
    } else if ((t /= d / 2) === 2) {
      return b + c
    }
    if (!p) {
      p = d * (0.3 * 1.5)
    }
    if (a < Math.abs(c)) {
      a = c
      s = p / 4
    } else {
      s = p / (2 * Math.PI) * Math.asin(c / a)
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    } else {
      return a * Math.pow(2, -10 * (t -= 1)) *
        Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
    }
  },
  easeInBack(t, b, _c, d, s) {
    const c = _c - b
    if (s === undefined || s === 0) {
      s = 1.70158
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b
  },
  easeOutBack(t, b, _c, d, s) {
    const c = _c - b
    if (s === undefined || s === 0) {
      s = 1.70158
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
  },
  easeInOutBack(t, b, _c, d, s) {
    const c = _c - b
    if (s === undefined || s === 0) {
      s = 1.70158
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b
    } else {
      return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    }
  },
  easeInBounce(t, b, _c, d) {
    const c = _c - b
    const v = TweenFunctions.easeOutBounce(d - t, 0, c, d)
    return c - v + b
  },
  easeOutBounce(t, b, _c, d) {
    const c = _c - b
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
    }
  },
  easeInOutBounce(t, b, _c, d) {
    const c = _c - b
    let v
    if (t < d / 2) {
      v = TweenFunctions.easeInBounce(t * 2, 0, c, d)
      return v * 0.5 + b
    } else {
      v = TweenFunctions.easeOutBounce(t * 2 - d, 0, c, d)
      return v * 0.5 + c * 0.5 + b
    }
  }
}

export const animationSync = (callback, lastTime) => {
  if (typeof lastTime === 'undefined') {
    lastTime = 0
  }
  const currTime = new Date().getTime()
  const timeToCall = Math.max(0, 16.7 - (currTime - lastTime))
  lastTime = currTime + timeToCall
  const id = setTimeout(() => {
    callback(currTime + timeToCall, lastTime)
  },
  timeToCall)
  return id
}

export const cancelAnimationSync = (id) => {
  clearTimeout(id)
}

export class Animation {
  constructor(from, to, duration, timingFunc) {
    this.from = from
    this.to = to
    this.duration = duration
    this.timingFunc = timingFunc
    this.startTime = null
  }

  fire(action, completion) {
    this.startTime = new Date().getTime()
    this.action = action
    this._doAnimation(completion)
  }

  _doAnimation(completion) {
    const now = new Date().getTime()
    const elapsed = now - this.startTime
    const keyframe = this.timingFunc(elapsed, this.from, this.to, this.duration)
    if (elapsed >= this.duration) {
      this.action(this.to)
      cancelAnimationSync(this.sync)
      if (completion) {
        completion()
      }
      return
    }

    this.action(keyframe)

    this.sync = animationSync(() => {
      this._doAnimation(completion)
    }, now)
  }
}
