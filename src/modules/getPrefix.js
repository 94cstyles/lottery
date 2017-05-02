/**
 * 获取css属性前缀 null:不支持该属性
 * @param el 用于校验的element
 * @param property css属性
 * @param value 样式值 设置该值是会进行赋值
 * @returns {string || null}
 */
export default function (el, property, value) {
  function camelCase (str) {
    return str.replace(/-([a-z])/ig, function (all, letter) {
      return letter.toUpperCase()
    })
  }

  if (el.style[property] === undefined) {
    for (const vendor of ['webkit', 'ms', 'moz', 'o', null]) {
      if (!vendor) return null
      property = camelCase(vendor + '-' + property)
      if (el.style[property] !== undefined) {
        break
      }
    }
  }
  if (value) el.style[property] = value

  return property
}
