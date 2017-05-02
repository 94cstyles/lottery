let lastTime = 0
export const requestAnimationFrame = window.requestAnimationFrame ||
  window['msRequestAnimationFrame'] ||
  window['mozRequestAnimationFrame'] ||
  window['webkitRequestAnimationFrame'] ||
  window['oRequestAnimationFrame'] ||
  function (callback) {
    const currTime = new Date().getTime()
    const timeToCall = Math.max(0, 16 - (currTime - lastTime))
    const id = window.setTimeout(() => {
      callback(currTime + timeToCall) // eslint-disable-line
    }, timeToCall)

    lastTime = currTime + timeToCall
    return id
  }

export const cancelAnimationFrame = window.cancelAnimationFrame ||
  window['msCancelAnimationFrame'] ||
  window['mozCancelAnimationFrame'] ||
  window['webkitCancelAnimationFrame'] ||
  window['oCancelAnimationFrame'] ||
  function (id) {
    clearInterval(id)
  }
