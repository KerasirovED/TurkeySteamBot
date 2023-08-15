
import KeyboardButton from './keyboard-button.mjs'

export default class ReplyKeyboardMarkup {    
    constructor(keyboard, options) {
        this.keyboard = keyboard
        this.oneTimeKeyboard = options?.oneTimeKeyboard
        this.resizeKeyboard = options?.resizeKeyboard ?? true
    }

    /**
     * @param {Array[Array[KeyboardButton]]} value
     */
    set keyboard(value) {
        if (value instanceof Array === false)
            throw TypeError('The keyboard must be an array!')

        const nonArrayRowsCount = value.filter(row => row instanceof Array === false).length

        if (nonArrayRowsCount > 0) 
            throw TypeError('The keyboard must be an array of arrays!')

        value.forEach(row => {
            const nonKeyboardButtons = row.filter(key => key instanceof KeyboardButton === false)

            if (nonKeyboardButtons.length > 0)
                throw TypeError('The keyboard buttons must be instanses of KeyboardButton! Got: ' + nonArrayRowsCount.pop())
        })

        this._keyboard = value
    }

    get keyboard() {
        return this._keyboard
    }

    set oneTimeKeyboard(value) {
        this._oneTimeKeyboard = Boolean(value)
    }

    get oneTimeKeyboard() {
        return this._oneTimeKeyboard
    }

    set resizeKeyboard(value) {
        this._resizeKeyboard = Boolean(value)
    }

    get resizeKeyboard() {
        return this._resizeKeyboard
    }

    asJson() {
        const keyboard = this.keyboard.map(row => row.map(key => key.asJson()))

        const result = {
            keyboard: keyboard,
            resize_keyboard: this._resizeKeyboard
        }

        if (this.oneTimeKeyboard) {
            result.one_time_keyboard = this.oneTimeKeyboard
        }

        return result
    }
}