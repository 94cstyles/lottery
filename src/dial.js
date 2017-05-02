import './modules/assign'
import Events from './modules/events'
import getPrefix from './modules/getPrefix'
import { requestAnimationFrame, cancelAnimationFrame } from './modules/requestAnimationFrame'

class LotteryDial extends Events {
  constructor (pointer, options) {
    super()

    this.options = Object.assign({
      speed: 30, // 每帧速度
      areaNumber: 8, // 奖区数量
      deviation: 2 // 随机结果角度偏差值 为了防止出现指针和扇区分割线无限重合 单位:°
    }, options)
    this.pointer = pointer

    this.init()
  }

  init () {
    // 初始化样式设定
    this._transform = getPrefix(this.pointer, 'transform', 'translate3d(0,0,0)')
    getPrefix(this.pointer, 'backfaceVisibility', 'hidden')
    getPrefix(this.pointer, 'perspective', '1000px')

    this._raf = null
    this._runAngle = 0
    this._targetAngle = -1
  }

  reset (event = 'reset') {
    if (!this._raf) return
    cancelAnimationFrame(this._raf)
    this._raf = null
    this._runAngle = 0
    this._targetAngle = -1
    this.trigger(event)
    if (event === 'reset') getPrefix(this.pointer, this._transform, 'translate3d(0,0,0) rotate(0deg)')
  }

  setResult (index) {
    // 得到中奖结果 index:中奖奖区下标
    const singleAngle = 360 / this.options.areaNumber // 单个奖区角度值
    let endAngle = Math.random() * singleAngle // 随机得出结果在扇区内的角度

    endAngle = Math.max(this.options.deviation, endAngle)
    endAngle = Math.min(singleAngle - this.options.deviation, endAngle)
    endAngle = Math.ceil(endAngle + (index * singleAngle))

    this._runAngle = 0
    this._targetAngle = endAngle + (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止
  }

  step () {
    // 如果没有设置结束点 就匀速不停旋转
    // 如果设置了结束点 就减速到达结束点
    if (this._targetAngle === -1) {
      this._runAngle += this.options.speed
    } else {
      this._angle = (this._targetAngle - this._runAngle) / this.options.speed
      this._angle = this._angle > this.options.speed ? this.options.speed : this._angle < 0.5 ? 0.5 : this._angle
      this._runAngle += this._angle
      this._runAngle = this._runAngle > this._targetAngle ? this._targetAngle : this._runAngle
    }
    // 指针旋转
    getPrefix(this.pointer, this._transform, 'translate3d(0,0,0) rotate(' + (this._runAngle % 360) + 'deg)')

    if (this._runAngle === this._targetAngle) {
      this.reset('end')
    } else {
      this._raf = requestAnimationFrame(() => this.step())
    }
  }

  draw () {
    if (this._raf) return
    if (this.has('start')) this.trigger('start')
    this._angle = 0
    this._raf = requestAnimationFrame(() => this.step())
  }
}

export default LotteryDial
