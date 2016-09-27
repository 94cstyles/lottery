export default function (el, property, value) {
    function camelCase(str) {
        return str.replace(/-([a-z])/ig, function (all, letter) {
            return letter.toUpperCase();
        });
    }

    if (el.style[property] === undefined) {
        for (let vendor of ['webkit', 'ms', 'moz', 'o']) {
            property = camelCase(vendor + '-' + property);
            if (el.style[property] !== undefined) {
                break;
            }
        }
    }
    el.style[property] = value;

    return property;
}
