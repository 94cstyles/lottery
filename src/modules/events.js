export default class Events {
    constructor() {
        this._queue = [];
    }

    on(key, callback) {
        this._queue[key] = this._queue[key] || [];
        this._queue[key].push(callback);
        return this;
    }

    off(key, callback) {
        if (this._queue[key]) {
            let index = typeof (callback) === "undefined" ? -2 : this._queue[key].indexOf(callback);
            if (index === -2) {
                delete this._queue[key];
            } else if (index !== -1) {
                this._queue[key].splice(index, 1);
            }
            if (this._queue[key] && this._queue[key].length == 0) delete this._queue[key];
        }
        return this;
    }

    has(key) {
        return !!this._queue[key];
    }

    trigger(key, ...args) {
        if (this._queue[key]) {
            for (let callback of this._queue[key]) {
                callback.apply(this, args);
            }
        }
        return this;
    }
}