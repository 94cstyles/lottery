var lastTime = 0;
export var requestAnimationFrame = window.requestAnimationFrame || window['msRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['oRequestAnimationFrame'] || function (callback) {
        var currTime = new Date().getTime(),
            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
            id = window.setTimeout(() => {
                callback(currTime + timeToCall);
            }, timeToCall);

        lastTime = currTime + timeToCall;
        return id;
    };
export var cancelAnimationFrame = window.cancelAnimationFrame || window['msCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || window['webkitCancelAnimationFrame'] || window['oCancelAnimationFrame'] || function (id) {
        clearInterval(id);
    };