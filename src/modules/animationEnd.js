const animationEvent = function () {
  const el = document.createElement('div')
  const animations = {
    'animation': 'animationend',
    'webkitAnimation': 'webkitAnimationEnd',
    'msAnimation': 'MSAnimationEnd',
    'oAnimation': 'oanimationend'
  }

  for (const t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t]
    }
  }

  return null
}()

/**
 * 处理animate动画结束时间
 * @param el 绑定事件目标元素
 * @param callback 回调函数
 * @param animateTime 当不支持animationend使用settimeout处理 延迟时间
 */
export default function (el, callback, animateTime = 0) {
  function bind () {
    callback()
    el.removeEventListener(animationEvent, bind)
  }

  animationEvent ? el.addEventListener(animationEvent, bind) : setTimeout(() => callback(), animateTime)
}
