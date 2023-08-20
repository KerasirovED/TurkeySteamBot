
import isString from "../string-utils/isString.mjs"
import HandlerTypeError from "./handler-type-error.mjs"
import ParseMode from "./parse-mode.mjs"
import ReplyKeyboardMarkup from "./reply-keyboard-markup.mjs"

export default class Bot {
    session = {}

    constructor(token) {
        this.token = token
        this.botUri = `https://api.telegram.org/bot${token}`
    }

    getMe = async () => {
		return await fetch(this.botUri + "/getMe")
			.then(result => result.json())
	}
	
    #offset = 0
	async getUpdates(timeout) {
        let params = []

        params.push("?offset=" + (this.#offset + 1))

        if (timeout)
            params.push("?timeout=" + timeout)

        const uri = this.botUri + "/getUpdates" + params.join('&')

        // console.debug(`Request: '${uri}'`)

        return await fetch(uri)
            .then(result => result.json())
            .then(data => {
                // const received = `Received:\n${JSON.stringify(data, null, 4)}`

                if (!data.result) {
                    // console.error(received)
                    return []
                }

                // console.debug(received)
                return data?.result
            })
            .then(updates => {
                if (updates?.length > 0)
                    this.#offset = updates.slice().pop().update_id
                return updates
            })
	}

	async sendMessage(chatId, text, options) {
        const body = this._getMessageBody(chatId, text, options)

		return await this._callApiWithBody('sendMessage', body) 
            .then(message => this._appendMessageSystemFields(message))
	}

	async editMessageText(chatId, messageId, text, options) {
        const body = this._getMessageBody(chatId, text, options)

        body.message_id = messageId

	    return await this._callApiWithBody('editMessageText', body) 
            .then(message => this._appendMessageSystemFields(message))
	}

    async editMessageReplyMarkup(chatId, messageId, replyMarkup) {
        const body = {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: replyMarkup
        }

        return await this._callApiWithBody('editMessageReplyMarkup', body)
            .then(message => this._appendMessageSystemFields(message))
    }

    async deleteMessage(chatId, messageId) {
        const body = {
            chat_id: chatId,
            message_id: messageId
        }

        await this._callApiWithBody('deleteMessage', body)
    }

    _getMessageBody(chatId, text, options) {
        const body = this._getDefaultMessageBody(chatId, text)
        this._setParseMode(body, options)
        this._setReplyMarkup(body, options)
        
        return body
    }

    _getDefaultMessageBody(chatId, text) {
        return {
            chat_id: chatId,
            text: text,
            disable_web_page_preview: true
        }
    }

    _setReplyMarkup(body, options) {
        if (options?.reply_markup)
            body.reply_markup = options.reply_markup instanceof ReplyKeyboardMarkup
                ? options.reply_markup.asJson()
                : options.reply_markup
    }

    _setParseMode(body, options) {
        if (options?.parseMode)
            body.parse_mode = options.parseMode
    }

    async answerCallbackQuery(callbackQueryId, options) {
        const body = {
            callback_query_id: callbackQueryId,
            ...options
        }

        return await this._callApiWithBody('answerCallbackQuery', body)
    }

    async _callApiWithBody(method, body) {
        const uri = this.botUri + '/' + method

        const requestInfo = { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: body
		}

		console.debug(`Request: '${uri}'`)
		console.debug(`requestInfo:\n'${JSON.stringify(requestInfo, null, 4)}'`)

        requestInfo.body = JSON.stringify(body)

		return await fetch(uri, requestInfo)
			.then(response => response.json(), reason => console.error(`${method} rejected: ${reason}`))
            .then(data => {
                console.debug(`${method} received:\n${JSON.stringify(data, null, 4)}`)
                return data
            })
            .then(data => data.result)
            .catch(reason => console.error(`${method} caught an exception: ${reason}`))
    }

    async processUpdates(updates) {
        const messageUpdates = updates.filter(update => update.message)
            .map(update => update.message)
            .map(message => this._appendMessageSystemFields(message))

        const commandUpdates = messageUpdates
            .filter(message => message.entities?.map(entity => entity.type).includes('bot_command'))

        await Promise.all(
            commandUpdates.map(async update => 
                await this.commandHandlers.find(x => x.command === update.message.text.substring(1))
                    ?.handler(update.message))
        )

        const textUpdates = messageUpdates
            .filter(message => message.entities !== 'bot_command' && message.text !== undefined)
        
        await Promise.all(textUpdates.map(async message => {
            const textHandler = this.textHandlers.find(x => x.text === message.text)

            if (textHandler)
                await textHandler.handler(message)
            else
                await this.anyTexthandler(message)
        })) 

        const callbackUpdates = updates
            .filter(update => update.callback_query)
            .map(update => update.callback_query)
            .map(callback => this._appendCallbackSystemFields(callback))

        await Promise.all(callbackUpdates.map(async callback => {
            const callbackHandler = this.callbackHandlers.find(handler => handler.filter.test(callback.data))
            await callbackHandler?.handler(callback)
            await callback.answer()
        }))
    }

    commandHandlers = []
    registerCommandHandler(command, handler) {
        const addCommand = (command, handler) => {
            let sameCommand = this.commandHandlers.find(x => x.command === command)

            const newCommand = {
                command: command,
                handler: handler
            }
            
            if (sameCommand) {
                sameCommand.handler = newCommand.handler

                console.debug(`Replaced handler` + JSON.stringify(newCommand, null, 4))
            }
            else {
                this.commandHandlers.push(newCommand)

                console.debug('Registered new message handler\n' + JSON.stringify(newCommand, null, 4))
            }
        }
        
        if (typeof(handler) !== 'function')
            throw new HandlerTypeError()

        if (isString(command)) {
            addCommand(command, handler)
            return
        }

        if (command instanceof Array && command.every(x => isString(x))) {
            command.forEach(command => addCommand(command, handler))
            return
        }

        throw new TypeError('The command should be either a string or an array of strings!')
    }

    anyTexthandler = undefined
    registerAnyTextHandler(handler) {
        if (typeof(handler) !== 'function')
            throw new HandlerTypeError()

        console.debug('Registered new any text handler\n' + handler)
        this.anyTexthandler = handler
    }

    startPolling(delay) {
        const polling = () => setTimeout(async () => {
            // console.debug('Getting updates...')
            
            await this.getUpdates()
                .then(updates => this.processUpdates(updates))
    
            // console.debug('Updates have got!')
    
            polling()
        }, delay)

        polling()
    }

    _appendMessageSystemFields(message) {
        if (!message || typeof(message) !== 'object') 
            message = new Object(message)

        message.reply = async (text, options) => await this.sendMessage(message.chat.id, text, options)
        message.replyMd2 = async (text, options) => {
            if (!options)
                options = {}

            options.parseMode = ParseMode.MarkdownV2
            await this.sendMessage(message.chat.id, text, options)
        }

        message.editText = async (text, options) => await this.editMessageText(message.chat.id, message.message_id, text, options)
        message.editTextMd2 = async (text, options) => {
            options = Object(options)
            options.parseMode = ParseMode.MarkdownV2
            await this.editMessageText(message.chat.id, message.message_id, text, options)
        }

        message.delete = async () => await this.deleteMessage(message.chat.id, message.message_id)
        message.editMarkup = async (markup) => await this.editMessageReplyMarkup(message.chat.id, message.message_id, markup)

        this._appendSession(message, message.chat.id)

        return message
    }

    _appendCallbackSystemFields(callback) {
        if (!callback || typeof(callback) !== 'object')
            callback = new Object(callback)

        callback.answer = async (options) => await this.answerCallbackQuery(callback.id, options) 

        this._appendSession(callback, callback.message.chat.id)

        this._appendMessageSystemFields(callback.message)

        return callback
    }

    _appendSession(object, sessionKey) {
        if (!object || typeof(object) !== 'object')
            object = new Object(object)

        if (!this.session[sessionKey])
            this.session[sessionKey] = {}

        object.session = this.session[sessionKey]
    }

    textHandlers = []
    textHandler(text, handler) {
        if (!isString(text))
            throw new TypeError('The text should be a string!');

        if (typeof(handler) !== 'function')
            throw new HandlerTypeError();

        const prevHandler = this.textHandlers.find(x => x.text === text);

        if (prevHandler) {
            prevHandler.handler = handler
            return
        }

        this.textHandlers.push({
            text: text,
            handler: handler
        })
    }

    callbackHandlers = []
    callbackHandler(filter, handler) {
        filter = new RegExp(filter)
        this.callbackHandlers.push({filter: filter, handler: handler})
    }
}