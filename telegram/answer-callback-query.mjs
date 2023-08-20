
export default class {
    constructor(callbackQueryId) {
        this.callback_query_id = callbackQueryId
    }

    text(value) {
        this.text = value
        return this
    }

    showAlert(value) {
        this.show_alert = Boolena(value)
        return this
    }

    url(value) {
        this.url = value
        return this
    }

    cacheTime(value) {
        this.cache_time = parseInt(value)
        return this
    }
}