
export default class {
    constructor(text) {
        this.text = text
    }

    /**
     * @param {string} value
     */
    set text(value) {
        this.text = value
    }

    get text() {
        return this.text
    }

    text(value) {
        this.text = value
        return this
    }

    url(value) {
        this.url = value
        return this
    }

    callbackData(value) {
        this.callback_data = value
        return this
    }

    webApp(value) {
        this.web_app = value
        return this
    }

    loginUrl(value) {
        this.login_url = value
        return this
    }

    switchInlineQuery(value) {
        this.switch_inline_query = value
        return this
    }

    switchInlineQueryCurrentChat(value) {
        this.switch_inline_query_current_chat = value
        return this
    }

    switchInlineQueryChosenChat(value) {
        this.switch_inline_query_chosen_chat = value
        return this
    }

    callbackGame(value) {
        this.callback_game = value
        return this
    }

    pay(value) {
        this.pay = value
        return this
    }
}