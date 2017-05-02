import './modules/assign'
import Events from './modules/events'

class LotteryCard extends Events {
  constructor (canvas, options) {
    super()

    this.options = Object.assign({
      size: 20, // 滑动区域大小
      percent: 50, // 激活百分比 到该值就显示结果
      resize: true, // canvas大小是否是可变的
      cover: null
    }, options)

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this._first = true
    this._touch = false
    this.init()
    this.bind()
  }

  getCanvasInfo () {
    const info = this.canvas.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeftp || 0

    this.width = info.width
    this.height = info.height
    this.offsetX = Math.round(info.left + scrollLeft)
    this.offsetY = Math.round(info.top + scrollTop)
    this.canvas.width = info.width
    this.canvas.height = info.height
  }

  bind () {
    const SUPPORT_ONLY_TOUCH = ('ontouchstart' in window) && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent) // 是否支持touch

    this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown', this.onTouchStart.bind(this), false)
    this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove', this.onTouchMove.bind(this), false)
    document.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchend' : 'mouseup', this.onTouchEnd.bind(this))
    window.addEventListener('onorientationchange' in document ? 'orientationchange' : 'resize', this.onResize.bind(this))
  }

  init () {
    this._state = 'init'
    this.getCanvasInfo()

    // 绘制遮罩层
    this.ctx.closePath()
    this.ctx.globalCompositeOperation = 'source-over'
    const cover = this.options.cover
    if (cover instanceof Image) {
      this.ctx.fillStyle = this.ctx.createPattern(cover, 'repeat')
      this.ctx.rect(0, 0, this.width, this.height)
    } else {
      this.ctx.fillStyle = typeof cover === 'string' ? cover : 'gray'
      this.ctx.fillRect(0, 0, this.width, this.height)
    }
    this.ctx.fill()
    this.ctx.globalCompositeOperation = 'destination-out'
  }

  reset () {
    this._first = true
    this._touch = false
    this.canvas.style.backgroundImage = null
    this.init()
    this.trigger('reset')
  }

  setResult (url) {
    this.canvas.style.backgroundImage = 'url(' + url + ')' // 设置结果
  }

  draw () {
    if (this._state === 'end') return
    this._state = 'end'
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.trigger('end')
  }

  scratchPercent () {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
    let hits = 0

    for (let i = 0, ii = imageData.data.length; i < ii; i = i + 4) {
      if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
        hits++
      }
    }

    return (hits / (this.width * this.height)) * 100
  }

  getEventXY (e) {
    e = e.changedTouches ? e.changedTouches[0] : e
    return {
      x: e.pageX - this.offsetX,
      y: e.pageY - this.offsetY
    }
  }

  onTouchStart (e) {
    e.preventDefault()
    if (this._state === 'end') return
    if (this.has('start') && this._first) this.trigger('start')

    // 绘制起点
    const point = this.getEventXY(e)
    this._state = 'start'
    this._touch = true
    this._first = false

    this.ctx.beginPath()
    this.ctx.arc(point.x, point.y, this.options.size / 2, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.lineWidth = this.options.size
    this.ctx.moveTo(point.x, point.y)
  }

  onTouchMove (e) {
    e.preventDefault()
    if (!this._touch) return
    // 绘制路线
    const point = this.getEventXY(e)
    this.ctx.lineTo(point.x, point.y)
    this.ctx.stroke()
  }

  onTouchEnd (e) {
    if (!this._touch) return
    this._touch = false

    // 绘制终点
    const point = this.getEventXY(e)
    this.ctx.closePath()
    this.ctx.beginPath()
    this.ctx.arc(point.x, point.y, this.options.size / 2, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fill()

    // 计算已经刮掉的面积
    if (this.scratchPercent() >= this.options.percent) {
      this.ctx.clearRect(0, 0, this.width, this.height)
      this._state = 'end'
      this.trigger('end')
    }
  }

  onResize () {
    this._touch = false
    if (this.options.resize) {
      if (this._state !== 'end') {
        this.init()
      } else {
        this.getCanvasInfo()
      }
    } else {
      this.getCanvasInfo()
    }
  }
}

export default LotteryCard
