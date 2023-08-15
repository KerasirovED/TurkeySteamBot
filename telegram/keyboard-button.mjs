
import isString from './../string-utils/isString.mjs'

export default class KeyboardButton {
    constructor(text) {
        this.text = text
    }

    set text(value) {
        if (!isString(value))
            throw TypeError('The text should be a string!')

        this._text = value
    }

    get text() {
        return this._text
    }

    asJson() {
        const result = {
            text: this.text
        }

        return result
    }
}