
import InlineKeyboardButton from "./inline-keyboard-button.mjs"
import InlineKeyboardMarkup from "./inline-keyboard-markup.mjs"
import InlineKeyboardPaginatorAction from "./inline-keyboard-paginator-action.mjs"
import { callbackDelimeter } from "./constants.mjs"

export default class InlineKeyboardPaginator {

    // Members

    _callbackDataPrefix = 'ikp'

    _beginSign = '<<'
    _endSign = '>>'
    _forwardSign = '>'
    _backwardSign = '<'
    _pageNumberPattern = '- {} -'

    _beginButton = new InlineKeyboardButton(this._beginSign)
    _endButton = new InlineKeyboardButton(this._endSign)
    _forwardButton = new InlineKeyboardButton(this._forwardSign)
    _backwardButton = new InlineKeyboardButton(this._backwardSign)

    // Constructors

    constructor(keyboard) {
        if (keyboard instanceof InlineKeyboardMarkup)
            this.keyboard = keyboard.inline_keyboard
        else if (keyboard instanceof Array && keyboard[0] instanceof Array)
                this.keyboard = keyboard
        else if (keyboard instanceof Array)
            this.keyboard = [keyboard]
        else 
            this.keyboard = [[keyboard]]

        this.rowsInPage = 5
    }

    // Methods

    getPage(pageNumber) {
        pageNumber = parseInt(pageNumber)

        if (pageNumber < 0)
            pageNumber = 1 
            
        if (pageNumber > this.lastPageNumber)
            pageNumber = this.lastPageNumber

        const begin = (pageNumber - 1) * this.rowsInPage
        const end = begin + this.rowsInPage
        const userButtons = this.keyboard.slice(begin, end)

        const systemButtons = []

        if (begin !== 0) {
            systemButtons.push(this._fillButtonCallback(this._beginButton, pageNumber))
            systemButtons.push(this._fillButtonCallback(this._backwardButton, pageNumber))
        }

        systemButtons.push(new InlineKeyboardButton(this._getFormattedPageNumber(pageNumber)))

        if (end < this.keyboard.length) {
            systemButtons.push(this._fillButtonCallback(this._forwardButton, pageNumber))
            systemButtons.push(this._fillButtonCallback(this._endButton, pageNumber))
        }

        return new InlineKeyboardMarkup([...userButtons, systemButtons])
    }

    getPageByAction(action, currentPage) {
        currentPage = parseInt(currentPage)

        switch (action) {
            case InlineKeyboardPaginatorAction.Begin:
                return this.getPage(1)
            
            case InlineKeyboardPaginatorAction.End:
                return this.getPage(this.lastPageNumber)

            case InlineKeyboardPaginatorAction.Forward:
                return this.getPage(currentPage + 1)

            case InlineKeyboardPaginatorAction.Backward:
                return this.getPage(currentPage - 1)
        }
    }

    // Protected methods

    _getFormattedPageNumber(page) {
        return this._pageNumberPattern.replace('{}', page)
    }

    _fillButtonCallback(button, page) {
        let data = [this._callbackDataPrefix, page] 

        switch (button) {
            case this._beginButton: data.push(InlineKeyboardPaginatorAction.Begin); break;
            case this._endButton: data.push(InlineKeyboardPaginatorAction.End); break;
            case this._forwardButton: data.push(InlineKeyboardPaginatorAction.Forward); break;
            case this._backwardButton: data.push(InlineKeyboardPaginatorAction.Backward); break;
        }

        if (this._userCallbackData)
            data = data.concat(this._userCallbackData)

        return button.callbackData(data.join(callbackDelimeter))
    }

    // Getters & setters

    get lastPageNumber() {
        return Math.ceil(this.keyboard.length / this.rowsInPage)
    }

    get isEmpty() {
        return this.keyboard.length === 1 && this.keyboard[0].length === 0
    }

    get userCallbackData() {
        return this._userCallbackData
    }

    /**
     * @param {(arg0: Array)} data
     */
    set userCallbackData(data) {
        data = Array(data)
        this._userCallbackData = data.map(x => String(x))
    }

    /**
     * 
     * @param {(arg0: Array)} data 
     * @returns {InlineKeyboardPaginator}
     */
    userCallbackData(data) {
        this._userCallbackData = data
        return this
    }

    get callbackDataPrefix() {
        return this.callbackDataPrefix
    }

    /**
     * @param {string} value
     */
    set callbackDataPrefix(value) {
        this._callbackDataPrefix = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    callbackDataPrefix(value) {
        this._callbackDataPrefix = String(value)
        return this
    }

    get beginSign() {
        return this._beginSign
    }

    /**
     * @param {string} value
     */
    set beginSign(value) {
        this._beginSign = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    beginSign(value) {
        this._beginSign = String(value)
        return this
    }

    _endSign = '>>'

    get endSign() {
        return this._endSign
    }

    /**
     * @param {string} value
     */
    set endSign(value) {
        this._endSign = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    endSign(value) {
        this._endSign = String(value)
        return this
    }

    get forwardSign() {
        return this._forwardSign
    }

    /**
     * @param {string} value
     */
    set forwardSign(value) {
        this._forwardSign = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    forwardSign(value) {
        this._forwardSign = String(value)
        return this
    }

    get backwardSign() {
        return this._backwardSign
    }

    /**
     * @param {string} value
     */
    set backwardSign(value) {
        this._backwardSign = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    backwardSign(value) {
        this._backwardSign = String(value)
        return this
    }

    get pageNumberPattern() {
        return this._pageNumberPattern
    }

    /**
     * @param {string} value
     */
    set pageNumberPattern(value) {
        this._pageNumberPattern = String(value)
    }

    /**
     * 
     * @param {(arg0: string)} value
     * @returns {InlineKeyboardPaginator}
     */
    pageNumberPattern(value) {
        this._pageNumberPattern = String(value)
        return this
    }
}