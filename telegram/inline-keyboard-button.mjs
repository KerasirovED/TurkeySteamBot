
import { emptyCallbackData } from "./constants.mjs"

export default class {
    constructor(text) {
        this.text = String(text)
        this.callback_data = emptyCallbackData
    }

    /**
     * @param {string} value
     */
    text(value) {
        this.text = value
        return this
    }

    get text() {
        return this.text
    }

    text(value) {
        this._removeOtherParams()
        this.text = value
        return this
    }

    url(value) {
        this._removeOtherParams()
        this.url = value
        return this
    }

    callbackData(value) {
        this._removeOtherParams()
        this.callback_data = String(value)
        return this
    }

    webApp(value) {
        this._removeOtherParams()
        this.web_app = value
        return this
    }

    loginUrl(value) {
        this._removeOtherParams()
        this.login_url = value
        return this
    }

    switchInlineQuery(value) {
        this._removeOtherParams()
        this.switch_inline_query = value
        return this
    }

    switchInlineQueryCurrentChat(value) {
        this._removeOtherParams()
        this.switch_inline_query_current_chat = value
        return this
    }

    switchInlineQueryChosenChat(value) {
        this._removeOtherParams()
        this.switch_inline_query_chosen_chat = value
        return this
    }

    callbackGame(value) {
        this._removeOtherParams()
        this.callback_game = value
        return this
    }

    pay(value) {
        this._removeOtherParams()
        this.pay = value
        return this
    }

    _removeOtherParams() {
        Object.keys(this).filter(k => k !== 'text').forEach(k => delete this[k])
    }
}