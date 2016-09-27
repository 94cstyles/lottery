const animationEvent = function () {
    var el = document.createElement('div'),
        animations = {
            'animation': 'animationend',
            'webkitAnimation': 'webkitAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'oAnimation': 'oanimationend'
        };

    for (let t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }

    return null;
}();

export default function (el, callback, aniTime = 0) {
    function bind() {
        callback();
        el.removeEventListener(animationEvent, bind);
    }

    animationEvent ? el.addEventListener(animationEvent, bind) : setTimeout(callback, aniTime);
}