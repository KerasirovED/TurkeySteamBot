
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
        const body = this._getDefaultMessageBody(chatId, text)
        this._setParseMode(body, options)
        this._setReplyMarkup(body, options)
		return await this._callApiWithBody('sendMessage', body) 
	}

	async editMessageText(chatId, messageId, text, options) {
        const body = this._getDefaultMessageBody(chatId, text)
        body.message_id = messageId
        this._setParseMode(body, options)
        this._setReplyMarkup(body, options)
	    return await this._callApiWithBody('editMessageText', body) 
	}

    async deleteMessage(chatId, messageId) {
        const body = {
            chat_id: chatId,
            message_id: messageId
        }

        await this._callApiWithBody('deleteMessage', body)
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

    async _callApiWithBody(method, body) {
        const uri = this.botUri + '/' + method

        const requestInfo = { 
			method: 'POST',
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify(body)
		}

		console.debug(`Request: '${uri}'`)
		console.debug(`requestInfo:\n'${JSON.stringify(requestInfo, null, 4)}'`)

		return await fetch(uri, requestInfo)
			.then(response => response.json(), reason => console.error(`${method} rejected: ${reason}`))
            .then(data => {
                console.debug(`${method} received:\n${JSON.stringify(data, null, 4)}`)
                return data
            })
            .then(data => data.result)
            .then(message => this.appendSystemFields(message))
            .catch(reason => console.error(`${method} caught an exception: ${reason}`))
    }

    async processUpdates(updates) {
        updates.forEach(update => this.appendSystemFields(update?.message))

        const commandUpdates = 
            updates.filter(update => update?.message?.entities?.map(entity => entity.type).includes('bot_command'))

        await Promise.all(
            commandUpdates.map(async update => 
                await this.commandHandlers.find(x => x.command === update.message.text.substring(1))
                    ?.handler(update.message))
        )

        const textUpdates = updates.filter(update => update?.message?.entities !== 'bot_command' && update?.message?.text !== undefined)
        await Promise.all(textUpdates.map(async update => {
            const textHandler = this.textHandlers.find(x => x.text === update.message.text)

            if (textHandler)
                await textHandler.handler(update.message)
            else
                await this.anyTexthandler(update.message)
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

    appendSystemFields(message) {
        if (message && typeof(message) === 'object') {
            message.reply = async (text, options) => await this.sendMessage(message.chat.id, text, options)
            message.replyMd2 = async (text, options) => {
                if (!options)
                    options = {}

                options.parseMode = ParseMode.MarkdownV2
                await this.sendMessage(message.chat.id, text, options)
            }
            message.editText = async (text, options) => await this.editMessageText(message.chat.id, message.message_id, text, options)
            message.delete = async () => await this.deleteMessage(message.chat.id, message.message_id)

            const sessionKey = message.chat.id
            
            if (!this.session[sessionKey])
                this.session[sessionKey] = {}

            message.session = this.session[sessionKey]
        }

        return message
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
}